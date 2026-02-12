import { FileSearch } from "lucide-react";
import { useState } from "react";

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle } from "@/components/ui/card";
    
import AreaVariant from "./area-variant";
import { BarVariant } from "./bar-variant";
import { LineVariant } from "./line-variant";

type Props = {
    data?: {
        date: string;
        income: number;
        expenses: number;
    }[];
};

const Chart = ( {data = []}: Props) => {
    const [chartType, setChartType] = useState("area");

    const onTypeChange = (type: string) =>{
        setChartType(type);
    }

  return (
    <Card className="border-none drop-shadow-sm">
        <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-canter justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Transactions
            </CardTitle>
            {/* TODO: Add select */}
        </CardHeader>
        <CardContent>
            { data.length === 0 ? (
                <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
                    <FileSearch className="size-6 text-muted-foreground"/>
                    <p className="text-muted-foreground text-sm">
                      No data for this period  
                    </p>
                </div>
            )
            :(
                // <AreaVariant data={data}/>
                // <BarVariant data={data} />
                <LineVariant data={data}/>
            )}
        </CardContent>
    </Card>
  )
}

export default Chart