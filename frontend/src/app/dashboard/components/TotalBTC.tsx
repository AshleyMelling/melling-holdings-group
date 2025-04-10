"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function TotalBtcCard() {
  const [totalBtc, setTotalBtc] = useState<number | null>(null);
  const [btcPrice, setBtcPrice] = useState<{ usd: number; gbp: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const fetchEverything = async () => {
    setIsLoading(true);
    try {
      const [krakenRes, coldStorageRes, priceRes] = await Promise.all([
        fetch("/api/kraken/balance", {
          cache: "no-store",
          credentials: "include",
        }),
        fetch("/api/coldstorage/balance", { cache: "no-store" }),
        fetch("/api/kraken/prices", { cache: "no-store" }),
      ]);

      // Check each response
      if (!krakenRes.ok) {
        console.error("❌ /api/kraken/balance failed:", krakenRes.status);
        throw new Error("Kraken fetch failed");
      }
      if (!coldStorageRes.ok) {
        console.error(
          "❌ /api/coldstorage/balance failed:",
          coldStorageRes.status
        );
        throw new Error("Cold storage fetch failed");
      }
      if (!priceRes.ok) {
        console.error("❌ /api/kraken/prices failed:", priceRes.status);
        throw new Error("Price fetch failed");
      }

      // Parse responses as JSON
      const krakenData = await krakenRes.json();
      const coldData = await coldStorageRes.json();
      const priceData = await priceRes.json();

      // Process Kraken balance data. Assuming Kraken returns BTC balance under "XXBT"
      const krakenBTC = parseFloat(krakenData["XXBT"] || "0");
      // Process Cold Storage balance data. Assuming the endpoint returns { "BTC": "0.12345678" }
      const coldStorageBTC = parseFloat(coldData["BTC"] || "0");

      // Set the combined total BTC in state.
      setTotalBtc(krakenBTC + coldStorageBTC);

      // Process Kraken prices to obtain BTC price.
      // Check if priceData includes "BTC" or "XXBT", then set btcPrice accordingly.
      const btcKey = priceData["BTC"]
        ? "BTC"
        : priceData["XXBT"]
        ? "XXBT"
        : null;
      if (btcKey) {
        setBtcPrice(priceData[btcKey]);
      }
    } catch (err) {
      console.error("⚠️ fetchEverything error:", err);
      // Optionally set state to handle the error (e.g. show a toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEverything();
  }, []);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total BTC Holdings</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isLoading || totalBtc === null ? (
              <Loader2 className="animate-spin" />
            ) : (
              `${totalBtc.toFixed(8)} BTC`
            )}
          </CardTitle>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {btcPrice && totalBtc !== null && (
            <>
              <div>
                ≈ $
                {(totalBtc * btcPrice.usd).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                USD
              </div>
              <div>
                ≈ £
                {(totalBtc * btcPrice.gbp).toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                GBP
              </div>
            </>
          )}
          <div className="text-muted-foreground">
            Aggregated across Kraken &amp; Cold Storage
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,234
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            45,678
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +4.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
