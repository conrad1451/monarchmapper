"use client";
import React, { useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Prevents React 19 Hydration Mismatch (Error #527)
 * by deferring the rendering of children until the client-side mount.
 */
export const HydrationShield: React.FC<Props> = ({
  children,
  fallback = null,
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    // This matches the Server-Side render perfectly (empty or static)
    return <>{fallback}</>;
  }

  // Only renders on the client
  return <>{children}</>;
};
