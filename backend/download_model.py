from transformers import AutoTokenizer, M2M100ForConditionalGeneration

# This will download and cache the model if it's not already present
model = M2M100ForConditionalGeneration.from_pretrained("facebook/m2m100_418M")
tokenizer = AutoTokenizer.from_pretrained("facebook/m2m100_418M")

print("Model and tokenizer downloaded successfully.")
