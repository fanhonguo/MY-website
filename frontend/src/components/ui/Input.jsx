import { cn } from '@/utils/cn'

const Input = ({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={cn('flex flex-col gap-2', containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        className={cn(
          'px-4 py-3 rounded-lg bg-dark-800 border border-white/10 text-gray-100 placeholder-gray-500',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
          'hover:border-white/20',
          error && 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-400">{error}</span>
      )}
    </div>
  )
}

export default Input
