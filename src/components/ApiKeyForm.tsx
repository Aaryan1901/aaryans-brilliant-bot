
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void;
  isLoading?: boolean;
}

const ApiKeyForm = ({ onSubmit, isLoading = false }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError("API key is required");
      return;
    }
    
    if (!apiKey.startsWith("gsk_")) {
      setError("Invalid Groq API key format. It should start with 'gsk_'");
      return;
    }
    
    setError("");
    onSubmit(apiKey);
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md border-border bg-card shadow-lg slide-in">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Welcome to SuperChat</CardTitle>
            <CardDescription>
              Enter your Groq API key to start chatting with a powerful AI assistant.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="api-key" className="text-sm font-medium">
                  Groq API Key
                </label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="gsk_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-accent"
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Your API key is stored locally and never sent to our servers.</p>
                <p className="mt-2">
                  Don't have a Groq API key?{" "}
                  <a 
                    href="https://console.groq.com/keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Get one here
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Connect to Groq"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ApiKeyForm;
