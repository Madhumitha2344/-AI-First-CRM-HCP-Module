from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    GROQ_API_KEY: str
    SECRET_KEY: str = "crmsecret123abc"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
