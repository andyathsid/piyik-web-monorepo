'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function BackButton() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute left-4 top-4 md:left-8 md:top-8"
    >
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="rounded-full"
      >
        <Link href="/">
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to home</span>
        </Link>
      </Button>
    </motion.div>
  );
}