import { BasicChat } from "@/components/basic-chat"

export const metadata = {
  title: "Basic Chat Test | UpSide AI",
  description: "A simplified chat test for troubleshooting",
}

export default function BasicChatPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Basic Chat Test</h1>
      <p className="text-center mb-6">This is a simplified chat implementation for troubleshooting purposes.</p>
      <BasicChat />
    </div>
  )
}
