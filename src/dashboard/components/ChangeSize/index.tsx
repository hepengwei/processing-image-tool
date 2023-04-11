/**
 * 图片处理工具-修改尺寸Tab页
 */
import React, { useRef, useEffect, useState } from "react";
import { Checkbox, InputNumber, Button, message } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { sizeTostr, changeSize } from "utils/imageUtil";
import { ImgInfo } from "../../Dashboard";
import styles from "../../dashboard.module.scss";

interface ChangeSizeProps {
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
const maxWidthHeight = 10000;

// @ts-ignore
const { getMessage } = chrome.i18n;

const ChangeSize = (props: ChangeSizeProps) => {
  const {
    imgInfo,
    exportImage,
    imgDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onClear,
  } = props;
  const [keepOriginalProportion, setKeepOriginalProportion] =
    useState<boolean>(false);
  const [toWidth, setToWidth] = useState<number | null>(imgInfo.width);
  const [toHeight, setToHeight] = useState<number | null>(imgInfo.height);
  const doing = useRef<boolean>(false);

  // 修改是否保持原比例
  const onKeepProportionChange = (e: CheckboxChangeEvent) => {
    setKeepOriginalProportion(e.target.checked);
    const { width, height } = imgInfo;
    if (e.target.checked) {
      if (toWidth && toHeight) {
        setToWidth(null);
        setToHeight(null);
      } else if (toWidth) {
        const newHeight = Math.floor((toWidth * height) / width);
        setToHeight(newHeight);
      } else if (toHeight) {
        const newWidth = Math.floor((toHeight * width) / height);
        setToWidth(newWidth);
      }
    } else if (!toWidth && !toHeight) {
      setToWidth(width);
      setToHeight(height);
    }
  };

  // 修改宽度
  const onWidthChange = (value: number | null) => {
    setToWidth(value);
    if (keepOriginalProportion && value) {
      const { width, height } = imgInfo;
      const newHeight = Math.floor((value * height) / width);
      setToHeight(newHeight);
    }
  };

  // 修改高度
  const onHeightChange = (value: number | null) => {
    setToHeight(value);
    if (keepOriginalProportion && value) {
      const { width, height } = imgInfo;
      const newWidth = Math.floor((value * width) / height);
      setToWidth(newWidth);
    }
  };

  // 点击确定
  const onOk = () => {
    if (doing.current) {
      message.warning(getMessage("workHard"));
      return;
    }
    const { imgUrl, width, height } = imgInfo;
    if (!toWidth || !toHeight) {
      message.warning(getMessage("pleaseEnterWidthOrHeight"));
      return;
    }
    doing.current = true;
    const newImageData = changeSize(
      imgUrl,
      width,
      height,
      toWidth,
      toHeight,
      maxWidthHeight
    );
    if (newImageData) {
      exportImage(newImageData);
    } else {
      message.error(getMessage("operationFailure"));
    }
    doing.current = false;
  };

  useEffect(() => {
    setToWidth(imgInfo.width);
    setToHeight(imgInfo.height);
  }, [imgInfo]);

  return (
    <div>
      <div
        className={styles.imgBox}
        style={{
          borderColor: imgDragOver ? primaryColor : primaryShallowColor,
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className={styles.fileBox}>
          <img src={imgInfo.imgUrl} alt="" />
          <div className={styles.fileInfo}>
            <div className={styles.item}>
              {getMessage("filename")}：{imgInfo.name}
            </div>
            <div className={styles.item}>
              {getMessage("format")}：{imgInfo.fileType}
            </div>
            <div className={styles.item}>
              {getMessage("dimension")}：
              {imgInfo.width && imgInfo.height
                ? `${imgInfo.width}x${imgInfo.height}`
                : getMessage("unknown")}
            </div>
            <div className={styles.item}>
              {getMessage("size")}：{sizeTostr(imgInfo.size)}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.operationBtns}>
        <div className={styles.left}>
          <Checkbox
            className={styles.operationBtn}
            checked={keepOriginalProportion}
            onChange={onKeepProportionChange}
          >
            {getMessage("whetherMaintainOriginalProportion")}
          </Checkbox>
          <InputNumber
            className={styles.operationBtn}
            style={{ width: "160px" }}
            min={1}
            max={maxWidthHeight}
            precision={0}
            value={toWidth}
            addonBefore={getMessage("width")}
            onChange={onWidthChange}
          />
          <InputNumber
            className={styles.operationBtn}
            style={{ width: "160px" }}
            min={1}
            max={maxWidthHeight}
            precision={0}
            value={toHeight}
            addonBefore={getMessage("height")}
            onChange={onHeightChange}
          />
          <Button type="primary" className={styles.operationBtn} onClick={onOk}>
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
    </div>
  );
};

export default ChangeSize;
