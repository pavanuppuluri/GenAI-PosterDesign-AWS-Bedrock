import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ApiDemo() {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const callApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://your-api-endpoint.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl p-6 bg-white">
        <CardContent>
          <h2 className="text-xl font-bold mb-4 text-center">API Demo</h2>

          <Label htmlFor="input" className="block mb-1">
            Enter Input
          </Label>
          <Input
            id="input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mb-4"
            placeholder="Type something..."
          />

          <Button
            onClick={callApi}
            disabled={loading || !inputValue.trim()}
            className="w-full mb-4"
          >
            {loading ? "Calling API..." : "Send Request"}
          </Button>

          {response && (
            <div className="bg-gray-100 p-4 rounded-md border text-sm whitespace-pre-wrap">
              <strong>Response:</strong>
              <pre>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
