import clsx from 'clsx'
import { useEffect } from 'react'

type ModalProps = {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title: string
  readonly children: React.ReactNode
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps): JSX.Element | null => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={clsx('fixed inset-0 z-50 flex items-center justify-center')}
    >
      <button
        aria-label="Close modal"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        type="button"
      />
      <div
        className={clsx(
          'relative z-10',
          'mx-4 w-full max-w-md',
          'bg-white dark:bg-[#3a3a3f]',
          'rounded-xl',
          'shadow-xl',
          'p-6',
          'max-h-[90vh] overflow-auto',
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            {title}
          </h2>
          <button
            className={clsx(
              'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
              'text-2xl leading-none',
              'flex size-8 items-center justify-center',
            )}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  )
}

export default Modal
