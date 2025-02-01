import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import InputField from "@/components/Calculator/InputField";
import ResultCard from "@/components/Calculator/ResultCard";

const Index = () => {
  const { toast } = useToast();
  const [totalLeads, setTotalLeads] = useState<number | null>(null);
  const [customerValue, setCustomerValue] = useState<number | null>(null);
  const [currentResponseRate, setCurrentResponseRate] = useState<number | null>(null);
  const [currentClosingRate, setCurrentClosingRate] = useState<number | null>(null);
  const [aiResponseRate, setAiResponseRate] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  const validateAndCalculate = () => {
    // Reset results
    setShowResults(false);

    // Validate all inputs are present
    const missingFields = [];
    if (totalLeads === null) missingFields.push("Total Leads per Month");
    if (customerValue === null) missingFields.push("Average Customer Value");
    if (currentResponseRate === null) missingFields.push("Current Lead Response Rate");
    if (currentClosingRate === null) missingFields.push("Current Closing Rate");
    if (aiResponseRate === null) missingFields.push("AI's Response Rate");

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in the following fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Calculate results
    const improvedConversionRate = Math.min(
      currentClosingRate! + (aiResponseRate! - currentResponseRate!) * 0.1,
      100
    );

    const currentRevenue = totalLeads! * (currentClosingRate! / 100) * customerValue!;
    const improvedRevenue = totalLeads! * (improvedConversionRate / 100) * customerValue!;
    const revenueAtRisk = improvedRevenue - currentRevenue;

    console.log("Calculating results:", {
      totalLeads,
      customerValue,
      currentResponseRate,
      currentClosingRate,
      aiResponseRate,
      improvedConversionRate,
      currentRevenue,
      improvedRevenue,
      revenueAtRisk,
    });

    // Show results with animation
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Speed-to-Lead AI Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate the potential impact of AI on your lead conversion rates
          </p>
        </div>

        <div className="space-y-8">
          {/* Input Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Input Your Data
            </h2>
            <InputField
              label="Total Leads per Month"
              value={totalLeads === null ? "" : totalLeads}
              onChange={(value) => setTotalLeads(value || null)}
              min={0}
              max={100000}
            />
            <InputField
              label="Average Customer Value ($)"
              value={customerValue === null ? "" : customerValue}
              onChange={(value) => setCustomerValue(value || null)}
              min={0}
            />
            <InputField
              label="Current Lead Response Rate (%)"
              value={currentResponseRate === null ? "" : currentResponseRate}
              onChange={(value) => setCurrentResponseRate(value || null)}
              min={0}
              max={100}
            />
            <InputField
              label="Current Closing Rate (%)"
              value={currentClosingRate === null ? "" : currentClosingRate}
              onChange={(value) => setCurrentClosingRate(value || null)}
              min={0}
              max={100}
            />
            <InputField
              label="AI's Response Rate (%)"
              value={aiResponseRate === null ? "" : aiResponseRate}
              onChange={(value) => setAiResponseRate(value || null)}
              min={0}
              max={100}
            />
            <Button 
              onClick={validateAndCalculate}
              className="w-full mt-6"
              size="lg"
            >
              Calculate Impact
            </Button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="bg-white p-6 rounded-lg shadow-sm space-y-6 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Results</h2>
              <div className="space-y-4">
                <ResultCard
                  title="Improved Conversion Rate"
                  value={`${Math.min(
                    currentClosingRate! + (aiResponseRate! - currentResponseRate!) * 0.1,
                    100
                  ).toFixed(1)}%`}
                />
                <ResultCard
                  title="Additional Revenue"
                  value={`$${(
                    totalLeads! *
                    (Math.min(
                      currentClosingRate! + (aiResponseRate! - currentResponseRate!) * 0.1,
                      100
                    ) /
                      100) *
                    customerValue! -
                    totalLeads! * (currentClosingRate! / 100) * customerValue!
                  ).toLocaleString()}`}
                />
                <ResultCard
                  title="Revenue at Risk"
                  value={`$${Math.abs(
                    totalLeads! *
                      ((currentClosingRate! / 100) -
                        Math.min(
                          currentClosingRate! +
                            (aiResponseRate! - currentResponseRate!) * 0.1,
                          100
                        ) /
                          100) *
                      customerValue!
                  ).toLocaleString()}`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;