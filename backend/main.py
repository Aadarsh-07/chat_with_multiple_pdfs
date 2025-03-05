from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import chromadb
from chromadb.config import Settings
from pypdf import PdfReader
from io import BytesIO
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.embeddings import HuggingFaceEmbeddings
# from langchain.vectorstores import Chroma

from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain_groq import ChatGroq as Groq

# from langchain.llms import Groq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
# from langchain_community.llms import Groq  # If Groq is supported in langchain-community

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB
chroma_client = chromadb.Client(Settings(persist_directory="./chromadb"))
collection = chroma_client.get_or_create_collection("pdf_collection")

# Initialize Groq
groq_api_key = "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"
llm = Groq(api_key=groq_api_key)

# Initialize text splitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

# Initialize embeddings
embeddings = HuggingFaceEmbeddings()

def extract_text_from_pdf(file_content):
    pdf_reader = PdfReader(BytesIO(file_content))
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

def create_knowledge_base(texts):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(texts)
    vectorstore = Chroma.from_documents(docs, embeddings)
    return vectorstore

def load_knowledge_base():
    vectorstore = Chroma(persist_directory="./chromadb", embedding_function=embeddings)
    return vectorstore

def create_conversation_chain(vectorstore):
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        memory=memory
    )
    return conversation_chain

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    texts = []
    for file in files:
        content = await file.read()
        text = extract_text_from_pdf(content)
        texts.append(text)

    vectorstore = create_knowledge_base(texts)
    vectorstore.persist()

    return {"message": "Files uploaded and processed successfully"}

class SearchQuery(BaseModel):
    query: str

@app.post("/search")
async def search(query: SearchQuery):
    try:
        vectorstore = load_knowledge_base()
        conversation_chain = create_conversation_chain(vectorstore)
        response = conversation_chain({"question": query.query})
        return {"answer": response['answer']}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
