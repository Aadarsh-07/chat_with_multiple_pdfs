from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from typing import List
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from pypdf import PdfReader
from io import BytesIO
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
import os
from dotenv import load_dotenv
import re
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PERSIST_DIRECTORY = "./chromadb"

groq_api_key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(api_key=groq_api_key)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)


embeddings = HuggingFaceEmbeddings()
chroma_embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

def sanitize_collection_name(name):
    return re.sub(r'[^\w\s-]', '', name).strip().replace(' ', '_')

def extract_text_from_pdf(file_content):
    pdf_reader = PdfReader(BytesIO(file_content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def create_or_update_knowledge_base(texts, collection_name):
    chunks = text_splitter.split_text(texts)
    if not chunks:
        raise ValueError("No text chunks were created. The PDF might be empty or unreadable.")

    docs = [Document(page_content=chunk) for chunk in chunks]
    
    try:
        embeddings_list = embeddings.embed_documents([doc.page_content for doc in docs])
    except Exception as e:
        raise ValueError(f"Failed to generate embeddings: {str(e)}")

    if not embeddings_list or len(embeddings_list) == 0:
        raise ValueError("No embeddings were generated.")

    client = chromadb.Client(Settings(persist_directory=PERSIST_DIRECTORY))
    collection = client.get_or_create_collection(name=collection_name, embedding_function=chroma_embedding_function)

    collection.add(
        embeddings=embeddings_list,
        documents=[doc.page_content for doc in docs],
        ids=[f"doc_{i}" for i in range(len(docs))]
    )

    return collection

def load_knowledge_base(collection_name):
    client = chromadb.Client(Settings(persist_directory=PERSIST_DIRECTORY))
    collection = client.get_collection(name=collection_name, embedding_function=chroma_embedding_function)
    return Chroma(client=client, collection_name=collection_name, embedding_function=embeddings)

def create_conversation_chain(vectorstore):
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

def generate_collection_name(file_names):
    # Remove file extensions and sanitize names
    sanitized_names = [sanitize_collection_name(name.rsplit('.', 1)[0]) for name in file_names]
    return "_".join(sanitized_names)

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    all_texts = []
    file_names = []
    
    for file in files:
        try:
            content = await file.read()
            text = extract_text_from_pdf(content)
            if not text.strip():
                return {"error": f"Failed to extract text from {file.filename}. The file might be empty or corrupted."}
            all_texts.append(text)
            file_names.append(file.filename)
            logger.info(f"Successfully extracted text from {file.filename}")
        except Exception as e:
            logger.error(f"Error processing {file.filename}: {str(e)}")
            return {"error": f"Failed to process {file.filename}: {str(e)}"}
    
    try:
        collection_name = generate_collection_name(file_names)
        create_or_update_knowledge_base(" ".join(all_texts), collection_name)
        logger.info(f"Successfully processed all files into collection: {collection_name}")
    except Exception as e:
        logger.error(f"Error creating knowledge base: {str(e)}")
        return {"error": f"Failed to create knowledge base: {str(e)}"}
    
    return {"message": f"Files uploaded and processed successfully into collection: {collection_name}"}


class SearchQuery(BaseModel):
    query: str
    collection_name: str

@app.post("/search")
async def search(query: SearchQuery):
    try:
        vectorstore = load_knowledge_base(query.collection_name)
        conversation_chain = create_conversation_chain(vectorstore)
        response = conversation_chain({"question": query.query})
        return {"answer": response['answer']}
    except Exception as e:
        logger.error(f"Error during search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/collections")
async def get_collections():
    try:
        client = chromadb.Client(Settings(persist_directory=PERSIST_DIRECTORY))
        collection_names = client.list_collections()
        return {"collections": collection_names}
    except Exception as e:
        logger.error(f"Error fetching collections: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def get_api():
    return {"answer": "Hello"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
