/**
 * 图片处理工具-图片压缩Tab页
 */
import React, { useRef, useEffect, useState } from "react";
import { InputNumber, Button, message } from "antd";
import { exportToImage } from "utils/fileUtil";
import { sizeTostr, compression } from "utils/imageUtil";
import { ImgInfo } from "../../Dashboard";
import styles from "../../dashboard.module.scss";

interface CompressionProps {
  imgInfo: ImgInfo;
  imgDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
}

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";
const defaultCompressionDegree = 70;

// @ts-ignore
const { getMessage } = chrome.i18n;

const Compression = (props: CompressionProps) => {
  const { imgInfo, imgDragOver, onDragOver, onDragLeave, onDrop, onClear } =
    props;
  const [compressionDegree, setCompressionDegree] = useState<number>(
    defaultCompressionDegree
  );
  const doing = useRef<boolean>(false);

  // 导出图片
  const exportImage = (blob: Blob) => {
    if (!blob) return;
    let imgName = "image";
    if (imgInfo && imgInfo.name) {
      const arr = imgInfo.name.split(".");
      if (arr.length > 1) {
        arr.splice(arr.length - 1, 1, imgInfo.fileType.toLowerCase());
        imgName = arr.join(".");
      } else {
        arr.push(imgInfo.fileType.toLowerCase());
        imgName = arr.join(".");
      }
    }
    exportToImage(blob, imgName);
  };

  // 点击确定
  const onOk = () => {
    if (doing.current) {
      message.warning(getMessage("workHard"));
      return;
    }
    const { imageData, imgUrl, width, height, fileType } = imgInfo;
    doing.current = true;
    if (["JPG", "JPEG"].includes(fileType)) {
      compression(
        imgUrl,
        width,
        height,
        fileType,
        compressionDegree,
        (blob: Blob | null) => {
          if (blob) {
            exportImage(blob);
          } else {
            message.error(getMessage("operationFailure"));
          }
          doing.current = false;
        }
      );
    } else {
      compression(
        imageData,
        width,
        height,
        fileType,
        compressionDegree,
        (blob: Blob | null) => {
          if (blob) {
            exportImage(blob);
          } else {
            message.error(getMessage("operationFailure"));
          }
          doing.current = false;
        }
      );
    }
  };

  useEffect(() => {
    setCompressionDegree(defaultCompressionDegree);
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
          <InputNumber
            className={styles.operationBtn}
            style={{
              width: getMessage("@@ui_locale") === "zh_CN" ? "200px" : "240px",
            }}
            min={10}
            max={90}
            precision={0}
            value={compressionDegree}
            addonBefore={getMessage("compressibility")}
            addonAfter="%"
            onChange={(value: number | null) => {
              setCompressionDegree(value || 10);
            }}
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

export default Compression;
