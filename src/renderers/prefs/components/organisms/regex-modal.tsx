import { useEffect, useState } from 'react'

import type { AppName } from '../../../../config/apps.js'
import Button from '../../../shared/components/atoms/button.js'
import Modal from '../../../shared/components/molecules/modal.js'
import RegexPatternsList from '../molecules/regex-patterns-list.js'

type RegexModalProps = {
  readonly appName: AppName | null
  readonly initialPatterns: string[]
  readonly onClose: () => void
  readonly onSave: (patterns: string[]) => void
}

const RegexModal = ({
  appName,
  initialPatterns,
  onClose,
  onSave,
}: RegexModalProps): JSX.Element => {
  const [patterns, setPatterns] = useState<string[]>(initialPatterns)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPatterns(initialPatterns)
    setError(null)
  }, [appName, initialPatterns])

  const validateAllPatterns = (): boolean => {
    for (const pattern of patterns) {
      if (pattern) {
        try {
          const regex = new RegExp(pattern, 'u')
          regex.test('')
        } catch {
          setError(`Invalid pattern: "${pattern}"`)
          return false
        }
      }
    }

    return true
  }

  const handleSave = () => {
    if (validateAllPatterns()) {
      onSave(patterns)
      setError(null)
    }
  }

  return (
    <Modal
      isOpen={appName !== null}
      onClose={onClose}
      title={appName ? `Set RegEx patterns for ${appName}` : 'RegEx patterns'}
    >
      <div className="space-y-4">
        <RegexPatternsList
          initialPatterns={patterns}
          onPatternsChange={setPatterns}
        />

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Apply</Button>
        </div>
      </div>
    </Modal>
  )
}

export default RegexModal
