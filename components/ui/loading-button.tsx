import * as React from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

/** shadcn Button that shows a spinner and disables itself while `loading`. */
function LoadingButton({
  loading,
  disabled,
  children,
  icon,
  ...props
}: React.ComponentProps<typeof Button> & {
  loading?: boolean
  /** shown instead of the spinner when idle */
  icon?: React.ReactNode
}) {
  return (
    <Button disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <Spinner /> : icon}
      {children}
    </Button>
  )
}

export { LoadingButton }
