"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LoaderLineIcon } from "@/assets/icons/LoaderLineIcon"
import { Button } from "@/components/ui/button"

interface Props {
  onDelete: () => Promise<boolean>
}

export function DeleteCarDialog({ onDelete }: Props) {
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteClick() {
    setDeleting(true)

    const success = await onDelete()

    if (!success) {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          type="button" 
          className="w-full h-10 bg-red-500 hover:bg-red-800 text-white cursor-pointer"
          disabled={deleting}
        >
          {deleting && (
            <LoaderLineIcon className="size-4 animate-spin" />
          )}
          {!deleting && "Delete Car"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white border border-gray-300">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Car</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className="
              border-gray-300 shadow-none 
              bg-snow hover:bg-gray-300
              cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction 
            onClick={handleDeleteClick}
            className="bg-red-500 hover:bg-red-800 text-white cursor-pointer"
          >
            Delete permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}