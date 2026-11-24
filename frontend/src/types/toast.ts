export type ToastVariant = 'success' | 'danger'

export interface ToastMessage {
  id: number
  variant: ToastVariant
  message: string
}
