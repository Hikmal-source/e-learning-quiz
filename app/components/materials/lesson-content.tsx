"use client";

type TiptapNode = {
  type?: string;
  text?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: {
    type?: string;
  }[];
};

export default function LessonContent({
  content,
}: {
  content: unknown;
}) {
  // Legacy content
  if (typeof content === "string") {
    return (
      <div className="whitespace-pre-wrap text-[15px] leading-7 text-slate-700">
        {content}
      </div>
    );
  }

  // Tiptap JSON
  if (!content || typeof content !== "object") {
    return null;
  }

  const document = content as TiptapNode;

  if (!Array.isArray(document.content)) {
    return null;
  }

  return (
    <article className="text-[15px] leading-7 text-slate-700">
      {document.content.map((node, index) => (
        <NodeRenderer
          key={index}
          node={node}
        />
      ))}
    </article>
  );
}

function NodeRenderer({
  node,
}: {
  node: TiptapNode;
}) {
  switch (node.type) {
    case "paragraph":
      return (
        <p className="mb-5">
          <InlineContent node={node} />
        </p>
      );

    case "heading":
      return (
        <Heading node={node} />
      );

    case "bulletList":
      return (
        <ul className="mb-5 list-disc space-y-1 pl-6">
          {node.content?.map(
            (child, index) => (
              <NodeRenderer
                key={index}
                node={child}
              />
            )
          )}
        </ul>
      );

    case "orderedList":
      return (
        <ol className="mb-5 list-decimal space-y-1 pl-6">
          {node.content?.map(
            (child, index) => (
              <NodeRenderer
                key={index}
                node={child}
              />
            )
          )}
        </ol>
      );

    case "listItem":
      return (
        <li>
          {node.content?.map(
            (child, index) => (
              <NodeRenderer
                key={index}
                node={child}
              />
            )
          )}
        </li>
      );

    case "blockquote":
      return (
        <blockquote className="my-6 border-l-4 border-emerald-500 bg-emerald-50 px-5 py-4 text-slate-600">
          {node.content?.map(
            (child, index) => (
              <NodeRenderer
                key={index}
                node={child}
              />
            )
          )}
        </blockquote>
      );

    case "codeBlock":
      return (
        <CodeBlock node={node} />
      );

    case "hardBreak":
      return <br />;

    case "horizontalRule":
      return (
        <hr className="my-8 border-slate-200" />
      );

    default:
      return null;
  }
}

function Heading({
  node,
}: {
  node: TiptapNode;
}) {
  const level = Number(
    node.attrs?.level ?? 2
  );

  if (level === 1) {
    return (
      <h1 className="mb-5 mt-8 text-3xl font-bold text-slate-950">
        <InlineContent node={node} />
      </h1>
    );
  }

  if (level === 3) {
    return (
      <h3 className="mb-3 mt-7 text-xl font-bold text-slate-900">
        <InlineContent node={node} />
      </h3>
    );
  }

  return (
    <h2 className="mb-4 mt-8 text-2xl font-bold text-slate-900">
      <InlineContent node={node} />
    </h2>
  );
}

function InlineContent({
  node,
}: {
  node: TiptapNode;
}) {
  return (
    <>
      {node.content?.map(
        (child, index) => (
          <InlineNode
            key={index}
            node={child}
          />
        )
      )}
    </>
  );
}

function InlineNode({
  node,
}: {
  node: TiptapNode;
}) {
  if (node.type !== "text") {
    return null;
  }

  let result: React.ReactNode =
    node.text ?? "";

  const marks = node.marks ?? [];

  if (
    marks.some(
      (mark) => mark.type === "code"
    )
  ) {
    result = (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-emerald-700">
        {result}
      </code>
    );
  }

  if (
    marks.some(
      (mark) => mark.type === "bold"
    )
  ) {
    result = (
      <strong className="font-semibold text-slate-900">
        {result}
      </strong>
    );
  }

  if (
    marks.some(
      (mark) => mark.type === "italic"
    )
  ) {
    result = (
      <em className="italic">
        {result}
      </em>
    );
  }

  return result;
}

function CodeBlock({
  node,
}: {
  node: TiptapNode;
}) {
  const code =
    node.content
      ?.map(
        (child) => child.text ?? ""
      )
      .join("") ?? "";

  return (
    <pre className="my-6 overflow-x-auto rounded-2xl bg-slate-950 p-5">
      <code className="font-mono text-sm leading-7 text-slate-200">
        {code}
      </code>
    </pre>
  );
}