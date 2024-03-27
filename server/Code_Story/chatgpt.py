import shutil
import openai
import PyPDF2  # Import PyPDF2 for PDF text extraction
import fitz
import re
import spacy
import numpy as np
import json
import requests
import io
import base64
import re
import PIL.Image 
import time
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
import os
import sys
url = "http://127.0.0.1:7860"
# # Provide the PDF path
# Extract the PDF path from the command-line arguments
pdf_path = sys.argv[1]

# Now you can use pdf_path variable for further processing
print("PDF path:", pdf_path)


common_path = r"C:\Users\awzah\Desktop\Uni\7th_Sem\FYP-I\fyp_login_auth\server"


import constants
#print("Current working directory:", os.getcwd())

os.environ["OPENAI_API_KEY"] = constants.APIKEY

def call_to_gpt(query):
    completion=openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role":"user", "content":query}]
    )
    reply_content=completion.choices[0].message.content
    return reply_content
# Extract text from the PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text

#encode images to send to image to image API Call
def encode_file_to_base64(path):
    with open(path, 'rb') as file:
        return base64.b64encode(file.read()).decode('utf-8')
    

def extract_initial_characters(pdf_text):
    # Set up your OpenAI API key
    openai.api_key = "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"

    # query = "I will provide you a story of a book, I want to generate characters and scenes from this book using a text to image model, I am going to give you examples of what effective prompts look like. prompt 1:(masterpiece), (best quality),1girl, solo, flower, long hair, outdoors, letterboxed, school uniform, day, sky, looking up, short sleeves, parted lips, shirt, cloud, black hair, sunlight, white shirt, serafuku, upper body, from side, pink flower, blurry, brown hair, blue sky, depth of field. prompt 2:(masterpiece), (best quality),1girl with long white hair sitting in a field of green plants and flowers, her hand under her chin, warm lighting, white dress, blurry foreground. prompt 3:(masterpiece), (best quality),cinematic composition, letterboxed, depth of field, solo focus, astronaut sitting in a field of yellow flowers with resting on the ground, gloves, yellow flower, black gloves, spacesuit, science fiction, sunlight, black hair, blue eyes, looking at viewer\nThis is the story: \n" + pdf_text + "The story has ended. Now I want you to generate effective prompts of all the characters from this story similar to the effective prompt examples I have provided above. Don't add anything else. Give me at least 5 prompts."
    query="I will provide you a story of a book, I want to generate characters from this book using a text to image model, I am going to \
        give you examples of what effective prompts look like. Prompt1: John, 1boy, 10 years old, wearing suit, wearing glasses, blue eyes, \
            red hair, depth of field \n Prompt 2: Clara, 1girl, 8 years old, wearing school uniform, wearing cap, green eyes, long hair, depth \
                of field \n Prompt 3: Emma, 1girl, 8 years old, overalls, pigtails, freckles, brown eyes, depth of field \n This is the \
                    story: \n" + pdf_text + "The story has ended. Now I want you to generate effective prompts of all the characters from \
                        this story similar to the effective prompt examples I have provided above. Don't add anything else. Don't repeat \
                            characters. There should only be 1 character in a prompt. And prompt should start with a name.\
                                    Don't tell the location of the characters. Also don't tell what the character is doing, or where the \
                                        character is. Just tell me how they look like, what they are \
                                            wearing. Use simple english. Don't use similies or metaphors. Give me only 3 characters. Don't \
                                                give me anything else"                                                                                                                                                                                                                                                                                                                                                                          
    # print(query)
    
    return call_to_gpt(query)
    
def store_initial_characters(reply_content):
    prompt_sentences = reply_content.split("Prompt ")
    # Remove the first empty string in the list
    prompt_sentences = prompt_sentences[1:]
    print("\n\n The characters that have been extracted are given below:")
    # Extract the text after each "Prompt" and print the resulting list of strings
    for prompt in prompt_sentences:
        # Use the string after the colon (if exists), removing leading and trailing whitespaces
        prompt_text = prompt.split(':', 1)[-1].strip()
        print(prompt_text)
    print("\n\n Splitting the characters and their descriptions in a dictionary.")

    data_dict = {}

    for string in prompt_sentences:
        # Split each string at the comma
        parts = string.split(', ')
        
        # Use the first part as the key and the rest as the value
        name = parts[0].split(':')[1].strip()
        description = ', '.join(parts[1:]).rstrip('\n')
        
        # Update the dictionary
        data_dict[name] = description

    # Print the resulting dictionary
    print("Keys:", data_dict.keys())
    print("Values:", data_dict.values())


    for name in data_dict:
      print("(masterpiece), (best quality), " + name + data_dict[name] )

    
    return data_dict

def text_to_image_generation(prompt, imageName):
    payload = {
            "prompt": prompt, 
            "negative_prompt": '''EasyNegative, nsfw, (worst quality:1.2), (low quality:1.2), 
                                  (lowres:1.1), (monochrome:1.1), (greyscale), multiple views, 
                                  comic, sketch, (((bad anatomy))), (((deformed))), (((disfigured))), 
                                  watermark, multiple_views, mutation hands, mutation fingers, 
                                  extra fingers, missing fingers, watermark''',
            "steps": 3,
            "width": 600,
            "height": 400
        }

    response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)
    r = response.json()
    if 'images' in r:
      image = PIL.Image.open(io.BytesIO(base64.b64decode(r['images'][0])))
      output_filename = imageName
      image.save(output_filename)
      print(f"Image saved: {output_filename}")
    else:
      print("Error: 'images' key not found in the response.")
      
def image_to_image_generation(prompt, ref_char, ImageName):
    init_image = encode_file_to_base64(common_path + "\\" + ref_char + ".png")
    payload = {
        "prompt": prompt,
        "negative_prompt": '''EasyNegative, nsfw, (worst quality:1.2), (low quality:1.2), 
                              (lowres:1.1), (monochrome:1.1), (greyscale), multiple views, 
                              comic, sketch, (((bad anatomy))), (((deformed))), (((disfigured))), 
                              watermark, multiple_views, mutation hands, mutation fingers, 
                              extra fingers, missing fingers, watermark''',
        "steps": 3,
        "init_images": [init_image],
        "restore_faces": True,
        "denoising_strength": 1,
        "width": 600,
        "height": 400
       
    }

    response = requests.post(url=f'{url}/sdapi/v1/img2img', json=payload)
    r = response.json()

    if 'images' in r:
        image = PIL.Image.open(io.BytesIO(base64.b64decode(r['images'][0])))
        output_filename = ImageName
        image.save(output_filename)
        print(f"Image saved: {output_filename}")
    else:
        print("Error: 'images' key not found in the response.") 

def generate_initial_characters(data_dict):
    i=0
    for name in data_dict:
        image_name=name+".png"
        prompt="(masterpiece), (best quality), " + name + data_dict[name]
        text_to_image_generation(prompt, image_name.lower())
        i+=1

  


# huzaif's work will come here, the inital images have been generated
# spacy's nlp model trained on english
nlp = spacy.load("en_core_web_sm")

def get_text(pdf_path):
    text = ""
    with fitz.open(pdf_path) as pdf_document:
        for page_num in range(pdf_document.page_count):
            page = pdf_document.load_page(page_num)
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

def all_scores(book_text):
    paragraphs = book_text.split('\n')
    final_paragraphs=book_text.split('\n')
    # Initialize an empty dictionary to store paragraph scores
    paragraph_scores = {}

    for i, paragraph in enumerate(paragraphs):
        pscore = score(paragraph)
        paragraph_scores[f"Paragraph {i+1}"] = {'Text': paragraph, 'Score': pscore}

    return paragraph_scores, final_paragraphs

def above_threshold(paras, threshold):
    filtered_paragraphs = [(num, data) for num, data in paras.items() if data['Score'] > threshold]
    return filtered_paragraphs

def extract_sceneic_paragraphs(threshold):
    pdf_text = get_text(pdf_path)
    cleaned_text = clean_text(pdf_text)
    scores,final_paragraphs = all_scores(cleaned_text)

    # getting paragraphs above the threshold
    above_threshold_paragraphs = above_threshold(scores, threshold)

    only_paragraphs = []
    para_with_context = []

    for paragraph_num, data in above_threshold_paragraphs:
        current_paragraph_num = int(paragraph_num.split()[1])

        if current_paragraph_num > 1:
            previous_paragraph_num = f"Paragraph {current_paragraph_num - 1}"
            previous_paragraph_text = scores[previous_paragraph_num]['Text']
            para_with_context.append(previous_paragraph_text + data['Text'])
        else:
            para_with_context.append(data['Text'])
        only_paragraphs.append(data['Text'])

    print("Total Paragraphs")
    print(len(only_paragraphs))

    return [only_paragraphs, para_with_context, final_paragraphs]

#End of Huzaifa's Part


'''
Here, we have to work with paragraphs, we have to iterate over each paragraph and search whether there
is a recognized character from the initial images or not. If there isn't then we'll simply run the 
txt_to_img model and create a description but if there is a character then we'll see whether it's only 
one or many. If there is one, we'll run the img_to_img model with a detail prompt else we'll run the 
text to image model with a detail prompt 
'''

# check whether a character is present in the paragraph or not
def check_keys_in_paragraph(data_dict, paragraph):
    # Convert both keys and paragraph to lowercase for case-insensitive comparison
    lowercase_keys = {key.lower() for key in data_dict.keys()}
    lowercase_paragraph = paragraph.lower()

    # Check if any lowercase key is present in the lowercase paragraph
    matching_keys = [key for key in lowercase_keys if key in lowercase_paragraph]

    return matching_keys

def generate_scenes(only_paragraphs, para_with_context,data_dict):
    index=1
    scenes_with_paragraphs={}
    for i, para in enumerate(para_with_context):
        image_name="output"+str(index)+".png"
        scenes_with_paragraphs[only_paragraphs[i]]=image_name
        print("Paragraph: ", index)
        print(para)
        if index%3==0:
          print("Sleeping for 60 seconds")
          time.sleep(61) 
        matching_chars = check_keys_in_paragraph(data_dict, para)
        # Print the matching keys
        print("Matching Characters:", matching_chars)
        result_string = ", ".join(matching_chars)
        #there is/are characters in the paragraph 
        query=""
        if (len(matching_chars)>=1):
            query="I will provide you a paragraph of a book\n Following is the paragraph: \n" + para + "The paragraph has ended \n. Now give \
                me a general description of what our characters are doing in the paragraphs, and their location. Describe the scene where the \
                    character is. Mention their names, and what they are doing. NOTE: the following examples are not from the book, they are \
                        just for guidance. \n For example: \n 1. Olivia, painting a mural on the seaside promenade \n 2. Sophia, concocting \
                            potions in a secret underground laboratory \n 3. Liam, practicing acrobatics in a sunlit meadow surrounded by \
                                wildflowers \n 4. Harper, sketching portraits in a quaint courtyard under the town's clock tower\n 5. Mason, \
                                    building a treehouse for friendly rabbits on a hill overlooking the valley \n 6. Ava, organizing a treasure \
                                        hunt in an ancient forest within the snowy mountains. \n Examples ended. Now following the format, tell \
                                            me about the characters of the paragraph provided. Don't give any extra information. I have the \
                                                following characters" + result_string + " Give me only one and no index number."
        else:
            query="I will provide you a paragraph of a book\n Following is the paragraph: \n" + para + "The paragraph has ended \n. Now just \
                give me a short description of the paragraph. Describe the scene basically"
        reply_content=call_to_gpt(query)
        print("\n\nScene extracted from the paragraph by GPT")
        print(reply_content)
        scene=reply_content.lower()
        print("\n\nScene extracted from the book but with the characters given their descriptions")
        # Update scenes with character descriptions
      
        # Update scenes with character descriptions
        for character, description in data_dict.items():
            character_lower = character.lower()
            scene = scene.replace(character_lower, f"{character}, {description},")
        # Display the updated scenes
        print(scene+"\n\n")
        prompt="(masterpiece), (best quality), " + scene 

        matching_chars = check_keys_in_paragraph(data_dict, scene)
        # Print the matching keys
        print("Matching Characters in the prompt given by GPT:", matching_chars)

        if len(matching_chars)==1:
            print("\n\ncalling function image to image for single character ")
            print(prompt,matching_chars[0],image_name)
            # text_to_image_generation(prompt,image_name)
            image_to_image_generation(prompt,matching_chars[0],image_name)
        else:
            print("\n\ncalling function text to image for multiple or no character")
            print(prompt,image_name)
            text_to_image_generation(prompt,image_name)        
        index+=1 #only 3 api calls allowed in a minute
    return scenes_with_paragraphs


pdf_text = extract_text_from_pdf(pdf_path)
reply_content=extract_initial_characters(pdf_text)
data_dict=store_initial_characters(reply_content)
generate_initial_characters(data_dict)
only_paragraphs, para_with_context, final_paragraphs=extract_sceneic_paragraphs(0.1)
scenes_with_paragraphs=generate_scenes(only_paragraphs, para_with_context, data_dict)


for para in scenes_with_paragraphs:
    print(para, " \n", scenes_with_paragraphs[para])
    print('\n\n')

for final_paragraph in final_paragraphs:
    if final_paragraph in scenes_with_paragraphs:
        print("\n\n Paragraph with an image")
        print(final_paragraph)
        print(scenes_with_paragraphs[final_paragraph])

def create_pdf(output_file, final_paragraphs, scenes_with_paragraphs, character_dict):
    doc = SimpleDocTemplate(output_file, pagesize=letter)
    styles = getSampleStyleSheet()

    # Create a list to hold the flowables (elements) of the document
    flowables = []

    # First page: Display characters
    flowables.append(Paragraph("<center><font size='16'>Book Characters</font></center>", styles['Heading1']))
    index=1
    for character, _ in character_dict.items():
        image_path = common_path + "\\" + character.lower() + ".png"  # Assuming images are named character_name.png
        character_img = Image(image_path)
        character_img.drawHeight = 150
        character_img.drawWidth = 200
        flowables.append(Spacer(1, 12))
        flowables.append(Paragraph(f"<b>{character}</b>", styles['Normal']))
        flowables.append(character_img)
        flowables.append(Spacer(1, 12))

    # Second page onwards: Display the story
    flowables.append(Paragraph("<center><font size='16'>Story</font></center>", styles['Heading1']))

    # Iterate through paragraphs and add them to the flowables list
    for paragraph in final_paragraphs:
        p = Paragraph(paragraph, styles['Normal'])
        flowables.append(p)

        # Check if the paragraph has an associated image
        if paragraph in scenes_with_paragraphs:
            image_path = common_path + "\\" + scenes_with_paragraphs[paragraph]
            img = Image(image_path)
            img.drawHeight = 200  # Adjust the height as needed
            img.drawWidth = 300   # Adjust the width as needed
            flowables.append(Spacer(1, 12))
            flowables.append(img)

        flowables.append(Spacer(1, 12))  # Add some space between paragraphs

    # Build the PDF document
    doc.build(flowables)

# Example usage
output_pdf = "output.pdf"
create_pdf(output_pdf, final_paragraphs, scenes_with_paragraphs, data_dict)

destination_directory = r"C:\Users\awzah\Desktop\Uni\7th_Sem\FYP-I\fyp_login_auth\server\files"

# Move the PDF file to the destination directory
shutil.move(output_pdf, destination_directory)