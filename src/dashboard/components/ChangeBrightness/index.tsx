/**
 * 图片处理工具-修改亮度Tab页
 */
import React, { useRef, useEffect, useState } from "react";
import { Slider, InputNumber, Button, message } from "antd";
import { sizeTostr, changeBrightness } from "utils/imageUtil";
import { ImgInfo } from "../../Dashboard";
import styles from "../../dashboard.module.scss";

interface ChangeBrightnessProps {
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

// @ts-ignore
const { getMessage } = chrome.i18n;

const ChangeBrightness = (props: ChangeBrightnessProps) => {
  const {
    imgInfo,
    exportImage,
    imgDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onClear,
  } = props;
  const [brightness, setBrightness] = useState<number | null>(0);
  const doing = useRef<boolean>(false);

  // 修改亮度值
  const onChange = (value: number | null) => {
    setBrightness(value);
  };

  // 点击确定
  const onOk = () => {
    if (doing.current) {
      message.warning(getMessage("workHard"));
      return;
    }
    const { imageData } = imgInfo;
    if (!brightness) {
      message.warning(getMessage("pleaseEnterBrightness"));
      return;
    }
    doing.current = true;
    const newImageData = changeBrightness(imageData, brightness);
    if (newImageData) {
      exportImage(newImageData);
    } else {
      message.error(getMessage("operationFailure"));
    }
    doing.current = false;
  };

  useEffect(() => {
    setBrightness(0);
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
          <div className={styles.operationBtn}>
            <span style={{ color: "#444", marginRight: "6px" }}>
              {getMessage("darken")}
            </span>
            <Slider
              min={-255}
              max={255}
              marks={{
                0: "0",
              }}
              value={typeof brightness === "number" ? brightness : 0}
              onChange={onChange}
            />
            <span style={{ color: "#444", marginLeft: "6px" }}>
              {getMessage("lighten")}
            </span>
            <InputNumber
              style={{ margin: "0 16px" }}
              min={-255}
              max={255}
              precision={0}
              value={brightness}
              onChange={onChange}
            />
          </div>
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

export default ChangeBrightness;
