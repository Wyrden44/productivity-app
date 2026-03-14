import { todoSchema } from "../../src/todos/todo.schema";
import { describe, it, expect } from "vitest";

describe("todoSchema", () => {
  const validTodo = {
    id: crypto.randomUUID(),
    text: "Test",
    done: false,
    deleted: false,
    updatedAt: 1000,
  };

  it("accepts valid todo", () => {
    const result = todoSchema.safeParse(validTodo);
    expect(result.success).toBe(true);
  });

  it("rejects empty text", () => {
    const result = todoSchema.safeParse({
      ...validTodo,
      text: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects long text", () => {
    const result = todoSchema.safeParse({
      ...validTodo,
      text: "a".repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid deleted", () => {
    const result = todoSchema.safeParse({
      ...validTodo,
      deleted: -1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid uuid", () => {
    const result = todoSchema.safeParse({
      ...validTodo,
      id: "not-a-uuid",
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative updatedAt", () => {
    const result = todoSchema.safeParse({
      ...validTodo,
      updatedAt: -1,
    });

    expect(result.success).toBe(false);
  });
});
