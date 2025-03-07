import { supabase } from "../lib/supabase";

export async function UpdateSingleField(
  tableName: string,
  fieldKey: string,
  keyValue: string | number,
  fieldToUpdate: string,
  newValue: any
) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ [fieldToUpdate]: newValue })
      .eq(fieldKey, keyValue);

    if (error) {
      console.error('Error updating field:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error updating field:', err);
    return false;
  }
}

