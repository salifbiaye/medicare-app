import * as React from "react"

import { cn } from "@/lib/utils"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
      <div
          data-slot="table-container"
          className="relative w-full overflow-x-auto rounded-[10px]  p-4"
      >
        <table
            data-slot="table"
            className={cn("w-full caption-bottom text-sm border-separate border-spacing-y-2", className)}
            style={{ borderSpacing: '0 8px' }}
            {...props}
        />
      </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="table-header" className={cn("text-muted-foreground border border-border ", className)} {...props} />
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" className={cn("", className)} {...props} />
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
      <tr
          data-slot="table-row"
          className={cn("  rounded-[10px]  group", className)}
          {...props}
      />
  )
}


function TableHead({ className, ...props }: React.ComponentProps<"th">) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "h-14 px-6 text-left align-middle first:rounded-l-lg last:rounded-r-lg text-xs font-medium uppercase tracking-wider",
                "text-gray-500 [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
                "bg-gray-600 hover:bg-gray-600  dark:bg-muted/40  ", // Fond pour l'en-tête
                className
            )}
            {...props}
        />
    )
}


function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
      <td
          data-slot="table-cell"
          className={cn(
              "py-2  px-6 align-middle  text-sm [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] hover:bg-gray-200 dark:hover:bg-muted first:rounded-l-lg last:rounded-r-lg border-b border-t first:border-l first:border-l-border fir last:border-r last:border-r-border bg-muted/30 dark:bg-muted/50 group-data-[state=selected]:bg-primary/10",
              className,
          )}
          {...props}
      />
  )
}

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
    ),
)
TableFooter.displayName = "TableFooter"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
    ({ className, ...props }, ref) => (
        <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
    ),
)
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }
