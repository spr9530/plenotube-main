import React from 'react'
import { addToast } from "@heroui/toast";



function generateToast({ type, message, title }) {
  addToast({
    title:` ${title}`,
    description: `${message}`,
    color: type,
  })
}

export default generateToast