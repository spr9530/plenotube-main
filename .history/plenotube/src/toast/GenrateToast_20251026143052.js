import React from 'react'
import { addToast } from "@heroui/toast";

const toastType = {
  error: "Danger",
  warning: "Warning",
  success: "Success"
}

function generateToast({ type, message, title }) {
  addToast({
    title:` ${title}`,
    description: `${message}`,
    color: toastType[type],
  })
}

export default generateToast