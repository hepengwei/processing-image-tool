/**
 * 图片处理工具-矩形裁剪Tab页
 */
import React from "react";
import RectSelect from "../RectSelect";
import { ImgInfo } from "../../Dashboard";

interface RectClipProps {
  imgInfo: ImgInfo;
  exportImage: (imageData: ImageData, exportImageType?: string) => void;
  imgDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
}

const RectClip = (props: RectClipProps) => {
  return <RectSelect {...props} type="clip" />;
};

export default RectClip;
