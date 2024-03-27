import json
import requests
import io
import base64
from PIL import Image


array = [
    # "(masterpiece, best quality), 1girl with wild brown hair and her loyal puppy, solo, enchanted forest, sunlight, surrounded by glowing insects, playful nymphs in the background, day, adventure, wonder, freckles, fluffy puppy, wide-eyed, nature, magical atmosphere",
    # "(masterpiece, best quality), group of friends (1girl, 1girl with curly golden hair, 1boy with fiery red hair), standing in awe at Rainbow Falls, sparkling waterfall, diamond-like mist, shimmering rainbow, colorful dresses, green shirt, joyful expressions, day, enchantment, exploration, laughter, vibrant colors",
    # "(masterpiece, best quality), wise old woman (1woman), Clara, seasoned explorer, mentor, standing amidst ancient trees, sharing stories with young explorers, forest background, wisdom, experience, day, nature, magical atmosphere, adventure",
    # "(masterpiece, best quality), 1woman, ((painting on a canvas)), vibrant scenes of the forest on her canvas, surrounded by lush gardens, under ancient trees, colorful artwork, inspiration, creativity, day, enchantment, magical world",
    "A masterpiece of a scene featuring Pan, the 10-year-old girl with wild brown hair and wide eyes, standing alone in a field of colorful flowers. The sunlight filters through the trees, creating a warm and enchanting atmosphere. Pan is wearing her school uniform, with her long hair flowing in the breeze. She gazes up at the sky, her parted lips showing a sense of awe and wonder. The scene is letterboxed, with the focus on Pan's upper body, and the background slightly blurry, emphasizing the beauty of the flowers."
]

# array = ["(masterpiece, best quality), 1woman, painting vibrant scenes of the forest on her canvas, surrounded by lush gardens, under ancient trees, colorful artwork, inspiration, creativity, day, enchantment, magical world" ]

url = "http://127.0.0.1:7860"

for prompt in array:
    payload = {
        "prompt": prompt,
        "negative_prompt": "(worst quality:1.6, low quality:1.6), (zombie, sketch, interlocked fingers, comic)",
        "steps": 20
    }

    response = requests.post(url=f'{url}/sdapi/v1/txt2img', json=payload)
    r = response.json()

    image = Image.open(io.BytesIO(base64.b64decode(r['images'][0])))
    output_filename = f'output_{array.index(prompt) + 10}.png'
    image.save(output_filename)
    print(f"Image saved: {output_filename}")
