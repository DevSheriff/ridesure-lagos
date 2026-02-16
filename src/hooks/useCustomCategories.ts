import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CustomCategory } from "@/data/lagos";

export function useCustomCategories() {
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("custom_categories")
        .select("*");

      if (!error && data) {
        setCustomCategories(
          data.map((row: any) => ({
            id: row.id,
            label: row.label,
            icon: row.icon,
            color: row.color,
            description: row.description || "",
          }))
        );
      }
    };
    fetch();
  }, []);

  const addCustomCategory = useCallback(async (cat: CustomCategory) => {
    // Check if already exists locally
    setCustomCategories((prev) => {
      if (prev.find((c) => c.id === cat.id)) return prev;
      return [...prev, cat];
    });

    // Upsert to DB (ignore conflict on id)
    await supabase
      .from("custom_categories")
      .upsert({
        id: cat.id,
        label: cat.label,
        icon: cat.icon,
        color: cat.color,
        description: cat.description,
      }, { onConflict: "id" });

    return cat;
  }, []);

  return { customCategories, addCustomCategory };
}
