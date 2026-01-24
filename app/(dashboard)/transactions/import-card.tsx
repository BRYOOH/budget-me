/* eslint-disable @typescript-eslint/no-explicit-any */
// This component renders a card for importing transactions from a CSV file. It displays the data in a table format and outlines the page outline after uploading the file.
import { useState } from "react";

import { convertAmountToMilliUnits } from "@/lib/utils";

import { transactions } from "@/database/schema";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

import ImportTable from "./import-table";

 
const requiredOptions = [
"amount",
 "date",
 "payee",
];

type TransactionInsert = typeof transactions.$inferInsert;
interface SelectedColumsStates {
  [key:string] :string | null;
}

type Props ={
  data: string[][];
  onCancel: () => void;
  onSubmit: (data:TransactionInsert[]) => void;
};

const ImportCard = ({
  data,
  onCancel,
  onSubmit 
}: Props) => {
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumsStates>({})

    const headers = data[0];
    const body = data.slice(1);

    //The onTableHeadSelectChange is used to sort the table columns with the requiredOptions above.
    const onTableHeadSelectChange = (
      columnIndex: number,
      value: string | null
    ) => {
      setSelectedColumns((prev) => {
        const newSelectedColumns  = { ...prev};

         //You can only sort one column head with one requiredOptions after it is selected it cannot be selected again. Until you unselect 
        for ( const key in newSelectedColumns) {
          if(newSelectedColumns[key] ===value){
              newSelectedColumns[key] = null;
          }
        }

        if(value === "skip"){
           value =  null;
        }

        newSelectedColumns[`column_${columnIndex}`] = value;
        return newSelectedColumns;
      });
    }

    //(TODO): The progress is used to convert values to an array then counts the columns selected
    const progress = Object.values(selectedColumns).filter(Boolean).length;

    //Used to sort the data in a structed format in the table
    const handleContinue = () =>{ 
        const getColumnIndex = (column:string) => {
          return column.split("_")[1]; 
          // Gets the columnIndex in column_${columnIndex}
        };

        const mappedData = {
          headers: headers.map((_header,index)=>{
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] || null; 
            // Returns the head of the columns which is the columnIndex
          }),
          body:body.map((row) =>{
            const transformedRow = row.map((cell,index) =>{
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
            }); // Returns the cell with the body data

            return transformedRow.every((item) => item === null) ? [] : transformedRow;
          }).filter((row) => row.length > 0),
        };

        console.log("mappedData",{mappedData});

        const arrayOfData = mappedData.body.map((row) => {
          return row.reduce((acc:any,cell,index) => {
            const header = mappedData.headers[index];
             if(header !== null) {
              acc[header] = cell;
             }

             return acc;
          }, {}); //Returns an object of data with columns that are not null to be sent to the backend
        });

        console.log("arrayOfData",{arrayOfData});

        const formattedData = arrayOfData
        .filter((item)=> item.date && String(item.date).trim() !== "")
        .map((item) =>{
          const rawDate = String(item.date).trim();

          console.log("rawDate", rawDate);

          return {
          ...item, 
          amount: convertAmountToMilliUnits(parseFloat(item.amount)),
          date: rawDate
          };
        })
        // before the error - format(parse(item.date, dateFormat, new Date()),outputFormat)

        console.log("formattedData",{formattedData});
        onSubmit(formattedData);
    };
    

    // ({  // Formatted date is used to change the amount and date to acceptable format for the database
    //       ...item, 
    //       amount: convertAmountToMilliUnits(parseFloat(item.amount)),
    //       date: format(parse(rawDate, dateFormat, new Date()),outputFormat)
    //     }));
  return (
     <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="gap-y-2 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-xl line-clamp-1">
                Import Transaction
                </CardTitle>
                <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-4 w-full">
                <Button 
                className="w-full lg:w-auto"
                onClick={onCancel} 
                size="sm">
                Cancel
                </Button>
                <Button
                className="w-full lg:w-auto"
                size="sm"
                disabled={progress < requiredOptions.length}
                onClick={handleContinue}
                >
                  Continue ({progress} / {requiredOptions.length})
                </Button>
                </div>
            </CardHeader>
            <CardContent>
               <ImportTable 
               headers={headers}
               body={body}
               selectedColumns={selectedColumns}
               onTableHeadSelectChange={onTableHeadSelectChange}
               /> 
            </CardContent>
        </Card>
      </div>
  )
}

export default ImportCard