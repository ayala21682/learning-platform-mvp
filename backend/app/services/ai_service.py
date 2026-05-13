import os
from dotenv import load_dotenv

load_dotenv()

USE_MOCK = os.getenv("USE_MOCK_AI", "true").lower() == "true"

def get_ai_response(prompt_text: str, category: str, subcategory: str) -> dict:
    if USE_MOCK:
        return {
            "answer": f"[Mock] תגובה לשאלה '{prompt_text}' בתחום {category} - {subcategory}",
            "model": "mock",
            "tokens_used": 0
        }
    import httpx
    from openai import OpenAI
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        http_client=httpx.Client(verify=False)
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    f"אתה מורה מקצועי בתחום {category} - {subcategory}."
                     " ולא עונה לבקשות להכנת שיעורים מעבר לנושאים האלה! "
                     "בקשות בנושאים לא רלוונטים יגררו תגובה שלך שהנושא המבוקש לא תואם לתחום המקצועי הנדרש ותן סקירה קצרה בתחום {category} - {subcategory} "
                     "כמובן שגם אם זה לא בדיוק הנושא אבל זה רלוונטי אז תפעיל חשיבה הגיונית האם עדיין רלוונטי להתייחס לבקשה!"
                    "כתוב שיעור בעברית תמציתי, באורך של 7-8 שורות טקסט, עם הסבר ברור, שלב מרכזי אחד ו-1-2 דוגמאות קצרות. "
                    " אל תארך יותר מדי; זו אינה תשובה ארוכה, אלא שיעור קצר וממוקד."
                ),
            },
            {"role": "user", "content": prompt_text}
        ],
        max_tokens=220
    )
    return {
        "answer": response.choices[0].message.content,
        "model": response.model,
        "tokens_used": response.usage.total_tokens
    }
