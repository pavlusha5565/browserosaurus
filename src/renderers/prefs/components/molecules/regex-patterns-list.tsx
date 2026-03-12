import clsx from 'clsx'
import type { ReactElement } from 'react'
import { useRef, useState } from 'react'

import Button from '../../../shared/components/atoms/button.js'
import Input from '../../../shared/components/atoms/input.js'

type RegexPatternsListProps = {
  readonly initialPatterns: string[]
  readonly onPatternsChange: (patterns: string[]) => void
}

type PatternEntry = {
  id: number
  error: string | null
  value: string
}

const RegexPatternsList = ({
  initialPatterns,
  onPatternsChange,
}: RegexPatternsListProps): ReactElement => {
  const nextPatternId = useRef(0)
  const createPatternEntry = (value: string): PatternEntry => {
    const patternEntry = {
      error: null,
      id: nextPatternId.current,
      value,
    }
    nextPatternId.current = nextPatternId.current + 1
    return patternEntry
  }

  const [patterns, setPatterns] = useState<PatternEntry[]>(
    initialPatterns.length > 0
      ? initialPatterns.map((value) => createPatternEntry(value))
      : [createPatternEntry('')],
  )

  const validatePattern = (pattern: string): string | null => {
    if (!pattern) return null

    try {
      const regex = new RegExp(pattern, 'u')
      regex.test('')
      return null
    } catch {
      return 'Invalid regular expression'
    }
  }

  const handlePatternChange = (index: number, value: string) => {
    const error = validatePattern(value)
    const updatedPatterns = [...patterns]
    updatedPatterns[index] = { ...updatedPatterns[index], error, value }
    setPatterns(updatedPatterns)
    onPatternsChange(updatedPatterns.map((p) => p.value))
  }

  const handleAddPattern = () => {
    const updatedPatterns = [...patterns, createPatternEntry('')]
    setPatterns(updatedPatterns)
    onPatternsChange(updatedPatterns.map((p) => p.value))
  }

  const handleRemovePattern = (index: number) => {
    const updatedPatterns = patterns.filter((_, i) => i !== index)
    const nextPatterns =
      updatedPatterns.length > 0 ? updatedPatterns : [createPatternEntry('')]

    setPatterns(nextPatterns)
    onPatternsChange(nextPatterns.map((p) => p.value))
  }

  return (
    <div className="space-y-4">
      <p className="text-sm opacity-70">
        URLs will open in this browser if they match at least one pattern.
      </p>

      <div className="space-y-3">
        {patterns.map(({ id, value, error }, index) => (
          <div key={id} className="space-y-1">
            <div className="flex gap-2">
              <Input
                className={clsx(
                  error && 'border-red-500 bg-red-50 dark:bg-red-900/20',
                  'h-10 flex-1',
                )}
                onChange={(e) => handlePatternChange(index, e.target.value)}
                placeholder="e.g., ^https://github\\.com"
                value={value}
                aria-label={`Regex pattern ${index + 1}`}
              />
              <button
                className={clsx(
                  'px-3 py-1',
                  'rounded-lg',
                  'leading-none',
                  'inline-flex items-center',
                  'shadow-sm',
                  'bg-white dark:bg-[#56555C]',
                  'border',
                  'border-b-[#C1BFBF] dark:border-b-[#56555C]',
                  'border-l-[#D4D2D2] dark:border-l-[#56555C]',
                  'border-r-[#D4D2D2] dark:border-r-[#56555C]',
                  'border-t-[#DAD8D8] dark:border-t-[#6E6D73]',
                  'hover:opacity-75',
                  'active:opacity-50',
                  'text-red-600 dark:text-red-400',
                )}
                onClick={() => handleRemovePattern(index)}
                type="button"
              >
                ✕
              </button>
            </div>
            {error ? (
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            ) : null}
          </div>
        ))}
      </div>

      <Button onClick={handleAddPattern}>+ Add Pattern</Button>
    </div>
  )
}

export default RegexPatternsList
