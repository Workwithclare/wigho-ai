"use client";

import { useState } from "react";
import { Box, Button, Card, Flex, Text } from "@radix-ui/themes";

// Mock/test data only — no DB, auth, or external services.
const MOCK_ITEMS = [
  {
    id: "mem-1",
    client: "Sarah — Quote follow-up",
    detail: "Promised quote by Friday. Source: Gmail mock thread #4821.",
    status: "Due soon",
    doneLabel: "Mark done"
  },
  {
    id: "mem-2",
    client: "David — Invoice reminder",
    detail: "Invoice #104 overdue by 2 days. Source: manual intake mock.",
    status: "Overdue",
    doneLabel: "Mark done"
  },
  {
    id: "mem-3",
    client: "Amara — Draft reply ready",
    detail: "Context-aware draft in Executive tone. Edit → Copy → Send.",
    status: "Draft ready",
    doneLabel: "Copy draft"
  }
];

export default function Page() {
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [briefVisible, setBriefVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleDone = (id: string) => {
    setDoneIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleCopyDraft = async (id: string) => {
    toggleDone(id);
    try {
      await navigator.clipboard.writeText(
        "Hi Sarah — following up with the quote you requested. Let me know a good time to review. — WihGo AI draft (mock)"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const openCount = MOCK_ITEMS.filter((i) => !doneIds.includes(i.id)).length;

  return (
    <Box style={{ background: "#060B14", minHeight: "100vh", padding: "48px 24px" }}>
      <Box
        style={{
          maxWidth: 860,
          margin: "0 auto",
          background: "#0A1628",
          border: "1px solid #1E293B",
          borderRadius: 16,
          padding: "56px 52px"
        }}
      >
        <Text
          size="2"
          weight="bold"
          style={{ color: "#14B8A6", letterSpacing: "0.18em", textTransform: "uppercase" }}
        >
          WIHGO AI • Business Memory & Attention
        </Text>

        <h1
          style={{
            color: "#FFFFFF",
            fontSize: 60,
            lineHeight: 1.02,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            margin: "18px 0"
          }}
        >
          AI Business Memory &amp; Attention
        </h1>

        <Text size="4" weight="medium" style={{ color: "#FFFFFF", lineHeight: 1.55 }}>
          Good morning — here&apos;s what needs your attention. {openCount} open{" "}
          {openCount === 1 ? "item" : "items"} from mock business memory. No live
          services connected.
        </Text>

        <Flex gap="3" mt="5" wrap="wrap">
          <Button
            size="3"
            style={{ background: "#0F766E", color: "#fff", cursor: "pointer" }}
            onClick={() => setBriefVisible((v) => !v)}
          >
            {briefVisible ? "Hide Catch Me Up brief" : "Catch Me Up"}
          </Button>
          <Text size="2" style={{ color: "#C0C5CE", alignSelf: "center" }}>
            {copied ? "Draft copied (mock) ✓" : "Mock/test data only"}
          </Text>
        </Flex>

        {briefVisible && (
          <Card
            mt="4"
            style={{ background: "#0B1F2A", border: "1px solid #0F766E" }}
          >
            <Text size="2" weight="bold" style={{ color: "#C0C5CE", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Today&apos;s brief — mock
            </Text>
            <Text size="3" mt="2" style={{ color: "#E5E7EB" }}>
              1 overdue, 1 due soon, 1 draft ready. Top priority: send Sarah the
              quote before Friday. Suggested action: copy the draft, then mark
              done.
            </Text>
          </Card>
        )}

        <Text
          size="2"
          weight="bold"
          mt="6"
          mb="3"
          style={{ color: "#C0C5CE", letterSpacing: "0.14em", textTransform: "uppercase", borderBottom: "1px solid #1E293B", paddingBottom: 10 }}
        >
          Attention items — mock memory
        </Text>

        <Flex direction="column" gap="3">
          {MOCK_ITEMS.map((item) => {
            const done = doneIds.includes(item.id);
            return (
              <Card
                key={item.id}
                style={{
                  background: done ? "#0A1A1A" : "#0B1F2A",
                  border: "1px solid #0F766E",
                  borderLeft: "4px solid #14B8A6",
                  opacity: done ? 0.75 : 1
                }}
              >
                <Flex justify="between" align="center" gap="3" wrap="wrap">
                  <Box>
                    <Text size="3" weight="bold" style={{ color: "#FFFFFF" }}>
                      {done ? "✓ " : ""}{item.client}
                    </Text>
                    <Text size="3" mt="1" style={{ color: "#E5E7EB" }}>
                      {item.detail}
                    </Text>
                    <Text size="2" mt="1" style={{ color: "#C0C5CE" }}>
                      Status: {done ? "Done (mock)" : item.status}
                    </Text>
                  </Box>
                  <Button
                    variant={done ? "soft" : "solid"}
                    style={{
                      background: done ? "#1E293B" : "#0F766E",
                      color: "#fff",
                      cursor: "pointer",
                      whiteSpace: "nowrap"
                    }}
                    onClick={() =>
                      item.id === "mem-3" ? handleCopyDraft(item.id) : toggleDone(item.id)
                    }
                  >
                    {done ? "Undo" : item.doneLabel}
                  </Button>
                </Flex>
              </Card>
            );
          })}
        </Flex>

        <Text size="2" mt="6" style={{ color: "#C0C5CE" }}>
          Local prototype only. Palette: deep teal + silver + black. No PostgreSQL,
          Better Auth, R2, or Gmail wired in this phase.
        </Text>
      </Box>
    </Box>
  );
}
