import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { simulationFormSchema, type SimulationFormValues } from "@/lib/validation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import HvacScene from "./components/Hvac";

interface SimulatorProps {
    onSimulate: (data: SimulationFormValues) => Promise<void>;
}

const Simulator: React.FC<SimulatorProps> = ({ onSimulate }) => {
    const form = useForm<SimulationFormValues>({
        resolver: zodResolver(simulationFormSchema),
    });

    const continentCities: Record<string, { value: string; label: string }[]> = {
        eastasia: [{ value: "tokyo", label: "Tokyo (JP)" }],
        europe: [
            { value: "dusseldorf", label: "Dusseldorf (DE)" },
            { value: "london", label: "London (UK)" },
        ],
        india: [
            { value: "chennai", label: "Chennai (IND)" },
            { value: "delhi", label: "Delhi (IND)" },
            { value: "hyderabad", label: "Hyderabad (IND)" },
        ],
        middleeast: [
            { value: "abudhabi", label: "Abu Dhabi (UAE)" },
            { value: "bahrain", label: "Bahrain (BH)" },
        ],
        oceania: [
            { value: "auckland", label: "Auckland (NZ)" },
            { value: "brisbane", label: "Brisbane (AU)" },
            { value: "christchurch", label: "Christchurch (NZ)" },
            { value: "melbourne", label: "Melbourne (AU)" },
            { value: "sydney", label: "Sydney (AU)" },
        ],
        southeastasia: [
            { value: "kaulalumpur", label: "Kuala Lumpur (MY)" },
            { value: "singapore", label: "Singapore (SG)" },
        ],
        us: [
            { value: "houston", label: "Houston (US)" },
            { value: "newyork", label: "New York (US)" },
            { value: "tampa", label: "Tampa (US)" },
            { value: "miami", label: "Miami (US)" }
        ],
    };

    const selectedContinent = form.watch("continent");
    const availableCities = selectedContinent ? continentCities[selectedContinent] ?? [] : [];

    // Add this to check if form is complete
    // const isFormComplete = form.watch(['location', 'chilledWaterTemp', 'coolingWaterTemp', 'ahuOpening']).every(Boolean);

    return (
        <div className="flex flex-col md:flex-row w-full h-full">
            {/* Left Side - 3D Building */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-[#F8FAFC] p-5">
                <HvacScene />
            </div>

            {/* Right Side - Tabs and Content */}
            <div className="w-full md:w-1/2 flex items-center justify-center"> 
                <Card className="overflow-hidden p-0 border-none rounded-none shadow-none w-full max-w-md"> 
                    <CardHeader className=""> 
                        <CardTitle className="text-xl font-bold text-center"> 
                            Simulation
                        </CardTitle>
                        <CardDescription className="text-sm text-center">
                            Fill in the details below to run the simulation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className=""> 
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSimulate)} className="flex flex-col gap-6 overflow-auto">
                                <FormField
                                    control={form.control}
                                    name="continent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Select Region</Label>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select region" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="eastasia">East Asia</SelectItem>
                                                    <SelectItem value="europe">Europe</SelectItem>
                                                    <SelectItem value="india">India</SelectItem>
                                                    <SelectItem value="middleeast">Middle East</SelectItem>
                                                    <SelectItem value="oceania">Oceania</SelectItem>
                                                    <SelectItem value="southeastasia">Southeast Asia</SelectItem>
                                                    <SelectItem value="us">US</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Select City</Label>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select city" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {!selectedContinent && (
                                                        <SelectItem value="placeholder" disabled>
                                                            Please select a region first
                                                        </SelectItem>
                                                    )}
                                                    {availableCities.map((c) => (
                                                        <SelectItem key={c.value} value={c.value}>
                                                            {c.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div>
                                <Label> Select baseline settings</Label>
                                <p className="text-xs text-muted-foreground">Well known paramters have been selected for simulation purposes. In real-time, it could be more number of parameters. </p>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="chilledWaterTemp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Chilled Water Temperature Setpoint (°C)</Label>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    className="flex flex-row space-y-1"
                                                >
                                                    {["6", "7", "8", "9"].map((temp) => (
                                                        <Label key={temp} className="flex items-center gap-2">
                                                            <RadioGroupItem value={temp} /> {temp} °C
                                                        </Label>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="coolingWaterTemp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Cooling Tower Water Setpoint Temperature(°C)</Label>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    className="flex flex-row space-y-1"
                                                >
                                                    {["29", "30", "31"].map((temp) => (
                                                        <Label key={temp} className="flex items-center gap-2">
                                                            <RadioGroupItem value={temp} /> {temp} °C
                                                        </Label>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="boilerOutletSetpointTemp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>Boiler Outlet Setpoint Temperature (°C)</Label>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    className="flex flex-row space-y-1"
                                                >
                                                    {/* {["50", "60", "70", "80"].map((opening) => (
                                                        <Label key={opening} className="flex items-center gap-2">
                                                            <RadioGroupItem value={opening} /> {opening} °C
                                                        </Label>
                                                    ))} */}

                                                    <Label key={50} className="flex items-center gap-2">
                                                        <RadioGroupItem value="50" /> 65 °C
                                                    </Label>

                                                    <Label key={60} className="flex items-center gap-2">
                                                        <RadioGroupItem value="60" /> 70 °C
                                                    </Label>

                                                    <Label key={70} className="flex items-center gap-2">
                                                        <RadioGroupItem value="70" /> 75 °C
                                                    </Label>

                                                    <Label key={80} className="flex items-center gap-2">
                                                        <RadioGroupItem value="80" /> 80 °C
                                                    </Label>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="ahuOpening"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label>AHU Damper opening %</Label>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                    className="flex flex-row space-y-1"
                                                >
                                                    {["80", "90", "100"].map((opening) => (
                                                        <Label key={opening} className="flex items-center gap-2">
                                                            <RadioGroupItem value={opening} /> {opening} %
                                                        </Label>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />



                                <Button
                                    type="submit"
                                    className="w-full rounded-none bg-[#000] text-white cursor-pointer hover:bg-[#F8FAFC] hover:text-black"
                                    style={{
                                        cursor: 'pointer',
                                    }}
                                >
                                    Simulate
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
};

export default Simulator;
