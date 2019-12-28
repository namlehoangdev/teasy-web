import {Button, Tooltip, Typography} from "@material-ui/core";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {FileCopy as FileCopyIcon} from "@material-ui/icons";
import DialogContent from "@material-ui/core/DialogContent";
import React, {useState} from "react";

export default function CopyRoomCodeButton({code}) {
    const [isCopied, setIsCopied] = useState(false);
    return (<CopyToClipboard text={code}>
        <Tooltip
            title={isCopied ? "Đã coppy" : "Copy mã thi nhanh"}
            aria-label="add"
            onCopy={() => setIsCopied(true)}
        >
            <Button
                onMouseLeave={() => setIsCopied(false)}
                onClick={() => setIsCopied(true)}
                onMouseOut={() => setIsCopied(false)}
            >
            <span
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center"
                }}
            >
              <Typography variant={"p"} style={{marginRight: 8}}>
                <b>{code}</b>
              </Typography>
              <FileCopyIcon color={"action"}/>
            </span>
            </Button>
        </Tooltip>
    </CopyToClipboard>);
}
