import React, { useEffect } from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select"
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { useScopeBook } from '@/lib/hooks/use-scope-book'


export function FooterText({ setSelectScope }: { setSelectScope: React.Dispatch<React.SetStateAction<any>> }) {

  const { books} = useScopeBook()

  const handleScopeChange = (value: string) => {
    const selectedBookObj = books.find(book => book.id === value);
    setSelectScope(selectedBookObj);
  };



return (
<div className='hover:cursor-pointer flex flex-shrink'>

    <Select onValueChange={handleScopeChange}>

        <SelectTrigger className="w-[180px]" defaultValue={`${books[0].book}`}>
          <SelectValue placeholder={`${books[0].book}`}/>
        </SelectTrigger>
        <SelectContent>
          {books.map(book => (
            <SelectItem key={book.id} value={book.id}>{book.book}</SelectItem>
          ))}
        </SelectContent>

      </Select>
   
</div>       
  )
}