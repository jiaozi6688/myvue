/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_UPLOAD_MAX_SIZE: string
  readonly VITE_TIMEOUT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}