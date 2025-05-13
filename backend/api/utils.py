from transformers import AutoTokenizer, M2M100ForConditionalGeneration
from gtts import gTTS
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
import uuid

# Load model and tokenizer once
model = M2M100ForConditionalGeneration.from_pretrained("facebook/m2m100_418M")
tokenizer = AutoTokenizer.from_pretrained("facebook/m2m100_418M")


def translate_text(text, source_lang, target_lang):
    """
    Translate text using facebook/m2m100_418M model.
    source_lang and target_lang should be language codes like 'en', 'hi', etc.
    """
    tokenizer.src_lang = source_lang  # Set source language
    model_inputs = tokenizer(text, return_tensors="pt")

    # Generate translated output
    generated_tokens = model.generate(
        **model_inputs,
        forced_bos_token_id=tokenizer.lang_code_to_id[target_lang]
    )

    translated_text = tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)[0]
    return translated_text


