import React from 'react'
import { addToast } from "@heroui/toast";

const type = {
  error: "Danger",
  warning: "Warning",
  success: "Success"
}

function GenrateToast({ type, message, title }) {
  addToast({
    title: "Toast title",
    description: `${message}`,
    color: type[type],
  })
}

export default GenrateToast