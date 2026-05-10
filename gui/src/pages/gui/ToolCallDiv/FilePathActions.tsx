import {
  ArrowTopRightOnSquareIcon,
  DocumentIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { IdeMessengerContext } from "../../../context/IdeMessenger";
import { ToolbarButtonWithTooltip } from "../../../components/StyledMarkdownPreview/StepContainerPreToolbar/ToolbarButtonWithTooltip";

interface FilePathActionsProps {
  filePath: string;
}

export function FilePathActions({ filePath }: FilePathActionsProps) {
  const ideMessenger = useContext(IdeMessengerContext);

  function handleOpenFile() {
    ideMessenger.post("openFile", { path: filePath });
  }

  function handleRevealInExplorer() {
    ideMessenger.post("revealInExplorer", { path: filePath });
  }

  function handleRevealInOS() {
    ideMessenger.post("revealInOS", { path: filePath });
  }

  return (
    <span
      className="ml-1 inline-flex items-center gap-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Open in editor */}
      <ToolbarButtonWithTooltip
        tooltipContent="Open in editor"
        onClick={handleOpenFile}
      >
        <DocumentIcon className="h-3 w-3 flex-shrink-0 opacity-60 hover:opacity-100" />
      </ToolbarButtonWithTooltip>

      {/* Reveal in File Explorer */}
      <ToolbarButtonWithTooltip
        tooltipContent="Reveal in Explorer"
        onClick={handleRevealInExplorer}
      >
        <FolderOpenIcon className="h-3 w-3 flex-shrink-0 opacity-60 hover:opacity-100" />
      </ToolbarButtonWithTooltip>

      {/* Reveal in OS file manager */}
      <ToolbarButtonWithTooltip
        tooltipContent="Reveal in OS"
        onClick={handleRevealInOS}
      >
        <ArrowTopRightOnSquareIcon className="h-3 w-3 flex-shrink-0 opacity-60 hover:opacity-100" />
      </ToolbarButtonWithTooltip>
    </span>
  );
}
