import fitz
import re
import spacy

# spacy's nlp model trained on english
nlp = spacy.load("en_core_web_sm")

def get_text(pdf_path):
    text = ""
    with fitz.open(pdf_path) as pdf_document:
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            text += page.get_text()

    return text

def clean_text(text):
    # puts two linebreaks after each paragraph
    text = re.sub(r'\.\s*\n', '.\n\n', text)
    # removes unnecessary linebreaks (3 or more together)
    text = re.sub(r'\n{4,}', '\n', text)
    # removes unnecessary linebreaks having spaces after them as well
    text = re.sub(r'\n\s+\n\s+\n\s+', '\n', text)
    # removing linebreaks that are not paragraphs
    text = re.sub(r'\n(?=[^\s])', '', text)
    
    return text

def score(paragraph):
    doc = nlp(paragraph)
    adjectives_count = len([token for token in doc if token.pos_ == 'ADJ'])
    adverbs_count = len([token for token in doc if token.pos_ == 'ADV'])
    num_words = len(doc)
    
    if num_words == 0:
        return 0.0
    
    imagery_score = (adjectives_count * 0.7 + adverbs_count * 0.3) / num_words

    return imagery_score

def get_paragraphs(book_text):
    paragraphs = book_text.split('\n')
    return paragraphs

def above_threshold(paras, threshold):
    filtered_paragraphs = [(num, data) for num, data in paras.items() if data['Score'] > threshold]
    return filtered_paragraphs

pdf_text = get_text("daniel2.pdf")

cleaned_text = clean_text(pdf_text)

paragraphs = cleaned_text.split('\n')

