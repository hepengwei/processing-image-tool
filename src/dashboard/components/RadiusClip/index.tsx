/**
 * 图片处理工具-圆角裁剪Tab页
 */
import React, { useEffect, useRef, useState } from "react";
import { Button, Checkbox, InputNumber, message } from "antd";
import { radiusClip } from "utils/imageUtil";
import { ImgInfo } from "../../Dashboard";
import styles from "./index.module.scss";

interface RadiusClipProps {
  imgInfo: ImgInfo;
  exportImage: (imageData: ImageData, exportImageType?: string) => void;
  imgDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
}

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";
const defaultBorderRadius = 4;

// @ts-ignore
const { getMessage } = chrome.i18n;

const RadiusClip = (props: RadiusClipProps) => {
  const {
    imgInfo,
    exportImage,
    imgDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onClear,
  } = props;
  const [imgSizeQualified, setImgSizeQualified] = useState<boolean>(false);
  const doing = useRef<boolean>(false);
  const [jpgToPNG, setJpgToPNG] = useState<boolean>(false);
  const [borderRadius, setBorderRadius] = useState<number | null>(
    defaultBorderRadius
  );

  useEffect(() => {
    const { width, height } = imgInfo;
    if (width < 20 || height < 20) {
      message.error(getMessage("imageTooSmall"));
      setImgSizeQualified(false);
      return;
    } else if (width > 1350 || height > 1350) {
      message.error(getMessage("imageTooLarge"));
      setImgSizeQualified(false);
      return;
    }
    setImgSizeQualified(true);
    setJpgToPNG(false);
    setBorderRadius(defaultBorderRadius);
  }, [imgInfo]);

  // 点击确定
  const onOk = () => {
    if (doing.current) {
      message.warning(getMessage("workHard"));
      return;
    }
    if (!borderRadius) {
      message.warning(getMessage("pleaseEnterFilletRadius"));
      return;
    }
    doing.current = true;
    const newImageData = radiusClip(
      imgInfo.imageData as ImageData,
      borderRadius,
      imgInfo.fileType,
      jpgToPNG
    );
    if (newImageData) {
      exportImage(newImageData, jpgToPNG ? "PNG" : imgInfo.fileType);
    } else {
      message.error(getMessage("operationFailure"));
    }
    doing.current = false;
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.imgBox}
        style={{
          borderColor: imgDragOver ? primaryColor : primaryShallowColor,
          width: `${Math.max(imgInfo.width, 1350)}px`,
          height: `${Math.max(imgInfo.height, 320)}px`,
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {imgSizeQualified && (
          <div
            className={styles.content}
            style={{
              width: `${imgInfo.width}px`,
              height: `${imgInfo.height}px`,
              borderRadius: `${borderRadius}px`,
            }}
          >
            <img src={imgInfo.imgUrl} className={styles.img} />
          </div>
        )}
      </div>
      {imgSizeQualified && (
        <div className={styles.operationBtns}>
          <div className={styles.left}>
            {imgInfo.fileType !== "PNG" && (
              <Checkbox
                className={styles.operationBtn}
                checked={jpgToPNG}
                onChange={(e) => {
                  setJpgToPNG(e.target.checked);
                }}
              >
                {getMessage("clippedAndConvertedToPng")}
              </Checkbox>
            )}
            <InputNumber
              className={styles.operationBtn}
              style={{ width: "180px" }}
              min={0}
              max={Math.min(
                Math.floor(imgInfo.width / 2),
                Math.floor(imgInfo.height / 2)
              )}
              precision={0}
              value={borderRadius}
              addonBefore={getMessage("filletRadius")}
              onChange={(value: number | null) => {
                setBorderRadius(value);
              }}
            />
            <Button
              type="primary"
              className={styles.operationBtn}
              onClick={onOk}
              disabled={!imgSizeQualified}
            >
              {getMessage("confirm")}
            </Button>
          </div>
          <div className={styles.right}>
            <Button ghost type="primary" onClick={onClear}>
              {getMessage("clear")}
            </Button>
            <div
              className={styles.link}
              onClick={() => {
                window.open("http://hepengwei.cn");
              }}
            >
              Visualization Collection
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RadiusClip;
