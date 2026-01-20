/* eslint-disable react/jsx-key */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { cn } from "@/lib/utils";

type Props ={
    columnIndex: number;
    selectedColumns: Record<string, string | null>;
    onChange: (
      columnIndex: number, 
      value: string | null
    ) => void;
}

//Options are used to sort the table by the requiredField
const options =[
    "amount",
    "date",
    "payee",
];

export default function TableHeadSelect ({
  columnIndex,
  selectedColumns,
  onChange }:Props
) {
  const currentSelection = selectedColumns[`column_${columnIndex}`];
  return ( 
   <Select
    value={currentSelection || "skip"}
    onValueChange= {(value) => onChange(columnIndex,value)}
   >
    <SelectTrigger className={cn("focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize", currentSelection && "text-blue-500")}>
      <SelectValue placeholder="Skip"/>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={"skip"}> Skip</SelectItem>
      {options.map((option,index) => {
        const disabled = Object.values(selectedColumns)
        .includes(option) && selectedColumns[ `column_${columnIndex}`] !== option;
        
        return (
        <SelectItem 
        value={option} 
        key={index} 
        disabled={disabled}
        className="capitalize">
          {option}
        </SelectItem>
      )
      })} 
    </SelectContent>
   </Select>
   )
}