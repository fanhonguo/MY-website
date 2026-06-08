import { cn } from '@/utils/cn'

const Card = ({
  children,
  className = '',
  padding = 'lg',
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  return (
    <div
      className={cn(
        'glass rounded-2xl',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
