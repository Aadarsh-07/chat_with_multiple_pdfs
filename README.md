Document-Based Conversational AI with FastAPI
This repository contains a FastAPI application that enables users to upload PDF files, process their text content into a searchable knowledge base, and perform conversational question answering using a language model. The project leverages ChromaDB for vector storage, LangChain for conversational AI, and HuggingFace embeddings for text processing.

Features
Upload PDFs: Extract text from uploaded PDF files and store them in a vector database.

Search Knowledge Base: Perform conversational queries on the processed documents.

Manage Collections: View and manage document collections stored in ChromaDB.

Conversational AI: Use Groq's language model to provide intelligent answers to user queries.

Tech Stack
FastAPI: High-performance web framework for building APIs.

ChromaDB: Vector database for storing and retrieving document embeddings.

LangChain: Framework for building conversational AI applications.

HuggingFace Embeddings: Pre-trained models for generating text embeddings.

PyPDF: Library for extracting text from PDF files.

Groq Language Model: Used for conversational AI capabilities.

Installation
Prerequisites
Python 3.8 or higher

pip package manager

Environment variables for Groq API key (GROQ_API_KEY)


STEPS:- 

1. clone this repository
  git clone https://github.com/Aadarsh-07/document-conversational-ai.git
  cd document-conversational-ai
2. Create a virtual environment:
     python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

3. Install dependencies:
     pip install -r requirements.txt
   
5. Create a .env file in the root directory and add your Groq API key

6. Run the application


**How It Works**

  1. PDF Processing:
  
    Extracts text using PyPDF.
    
    Splits text into smaller chunks using LangChain's RecursiveCharacterTextSplitter.
  
  2. Embedding Generation:
  
    Generates embeddings using HuggingFace models.
    
    Stores embeddings in ChromaDB as collections.

  3.Conversational AI:
  
    Retrieves relevant chunks from the vector store.
  
  Uses Groq's language model to answer user queries based on retrieved content.

Environment Variables
Make sure to define the following environment variable in your .env file:

