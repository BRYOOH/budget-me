/* eslint-disable @typescript-eslint/no-explicit-any */
// This component renders a table for importing transactions with selectable headers.The selected headers map to transaction fields like amount, date, and payee from the csv file.
import { 
  Table, 
  TableBody,
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow } from "@/components/ui/table";
import TableHeadSelect from "./table-head-select";

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (
      columnIndex: number, 
      value: string | null
    ) => void;
};
export default function ImportTable({
  headers,
  body,
  selectedColumns,
  onTableHeadSelectChange
}:any) {
  return (
    <div className="rounded-md border overflow-hidden">
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          { headers.map((_item:any, index:any) => (//what is the meaning of _item here
            <TableHead key={index}>
              <TableHeadSelect 
              columnIndex={index}
              selectedColumns={selectedColumns}
              onChange={onTableHeadSelectChange}
              />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
       <TableBody>
          {body.map((row:string[], index:any)=>(
            <TableRow key={index}>
              {row.map((cell:string, cellIndex:any)=>( 
                <TableCell key={cellIndex}> 
                {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
       </TableBody>
    </Table>
    </div>
  )
}
