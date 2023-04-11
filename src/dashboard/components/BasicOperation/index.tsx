/**
 * 图片处理工具-基础操作Tab页
 */
import React, { useRef, useEffect } from "react";
import { Button, message } from "antd";
import { cloneDeep } from "lodash-es";
import {
  sizeTostr,
  flipSideToSide,
  flipUpsideDown,
  leftRotate,
  rightRotate,
  toGrey,
  toBlackAndWhite,
  sharpen,
  marginSharpen,
  toOpposite,
  toRed,
  toGreen,
  toBlue,
  toRedAndGreen,
  toRedAndBlue,
  toBlueAndGreen,
  toRedAndGrey,
  toGreenAndGrey,
  toBlueAndGrey,
  jpgToPng,
  pngToJpg,
} from "utils/imageUtil";
import { ImgInfo } from "../../Dashboard";
import styles from "../../dashboard.module.scss";

interface BasicOperationProps {
  imgInfo: ImgInfo;
  exportImage: (imageData: ImageData, exportImageType?: string) => void;
  imgDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClear: () => void;
}

interface Status {
  doing: boolean;
  imageData: ImageData | null;
}

interface ImgStatusInfo {
  flipSideToSideStatus: Status;
  flipUpsideDownStatus: Status;
  leftRotateStatus: Status;
  rightRotateStatus: Status;
  toGreyStatus: Status;
  toBlackAndWhiteStatus: Status;
  sharpenStatus: Status;
  marginSharpenStatus: Status;
  toOppositeStatus: Status;
  toRedStatus: Status;
  toGreenStatus: Status;
  toBlueStatus: Status;
  toRedAndGreenStatus: Status;
  toRedAndBlueStatus: Status;
  toBlueAndGreenStatus: Status;
  toRedAndGreyStatus: Status;
  toGreenAndGreyStatus: Status;
  toBlueAndGreyStatus: Status;
  jpgToPngStatus: Status;
  pngToJpgStatus: Status;
}

const defaultImgStatus = {
  flipSideToSideStatus: { doing: false, imageData: null },
  flipUpsideDownStatus: { doing: false, imageData: null },
  leftRotateStatus: { doing: false, imageData: null },
  rightRotateStatus: { doing: false, imageData: null },
  toGreyStatus: { doing: false, imageData: null },
  toBlackAndWhiteStatus: { doing: false, imageData: null },
  sharpenStatus: { doing: false, imageData: null },
  marginSharpenStatus: { doing: false, imageData: null },
  toOppositeStatus: { doing: false, imageData: null },
  toRedStatus: { doing: false, imageData: null },
  toGreenStatus: { doing: false, imageData: null },
  toBlueStatus: { doing: false, imageData: null },
  toRedAndGreenStatus: { doing: false, imageData: null },
  toRedAndBlueStatus: { doing: false, imageData: null },
  toBlueAndGreenStatus: { doing: false, imageData: null },
  toRedAndGreyStatus: { doing: false, imageData: null },
  toGreenAndGreyStatus: { doing: false, imageData: null },
  toBlueAndGreyStatus: { doing: false, imageData: null },
  jpgToPngStatus: { doing: false, imageData: null },
  pngToJpgStatus: { doing: false, imageData: null },
};

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";

// @ts-ignore
const { getMessage } = chrome.i18n;

const BasicOperation = (props: BasicOperationProps) => {
  const {
    imgInfo,
    exportImage,
    imgDragOver,
    onDragOver,
    onDragLeave,
    onDrop,
    onClear,
  } = props;
  const imgStatusInfo = useRef<ImgStatusInfo>(cloneDeep(defaultImgStatus));

  const doTask = (
    status: Status,
    method: (imageData: ImageData) => ImageData | null,
    exportImageType?: string
  ) => {
    if (status && status.imageData) {
      exportImage(status.imageData);
    } else if (status.doing) {
      message.warning(getMessage("workHard"));
      return;
    } else if (imgInfo?.imageData) {
      status.doing = true;
      const newImageData = method(imgInfo.imageData);
      if (newImageData) {
        status.imageData = newImageData;
        exportImage(newImageData, exportImageType);
      } else {
        message.error(getMessage("operationFailure"));
      }
      status.doing = false;
    }
  };

  useEffect(() => {
    imgStatusInfo.current = cloneDeep(defaultImgStatus);
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
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.flipSideToSideStatus, flipSideToSide)
            }
          >
            {getMessage("flipSideToSide")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.flipUpsideDownStatus, flipUpsideDown)
            }
          >
            {getMessage("flipTopToBottom")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.leftRotateStatus, leftRotate)
            }
          >
            {getMessage("rotateLeft")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.rightRotateStatus, rightRotate)
            }
          >
            {getMessage("rotateRight")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() => doTask(imgStatusInfo.current.toGreyStatus, toGrey)}
          >
            {getMessage("graying")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(
                imgStatusInfo.current.toBlackAndWhiteStatus,
                toBlackAndWhite
              )
            }
          >
            {getMessage("vampix")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() => doTask(imgStatusInfo.current.sharpenStatus, sharpen)}
          >
            {getMessage("shmpch")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.marginSharpenStatus, marginSharpen)
            }
          >
            {getMessage("edgeSharpening")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.toOppositeStatus, toOpposite)
            }
          >
            {getMessage("filterContrast")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() => doTask(imgStatusInfo.current.toRedStatus, toRed)}
          >
            {getMessage("redFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() => doTask(imgStatusInfo.current.toGreenStatus, toGreen)}
          >
            {getMessage("greenFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() => doTask(imgStatusInfo.current.toBlueStatus, toBlue)}
          >
            {getMessage("blueFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.toRedAndGreenStatus, toRedAndGreen)
            }
          >
            {getMessage("redGreenFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.toRedAndBlueStatus, toRedAndBlue)
            }
          >
            {getMessage("redBlueFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.toBlueAndGreenStatus, toBlueAndGreen)
            }
          >
            {getMessage("blueGreenFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.toRedAndGreyStatus, toRedAndGrey)
            }
          >
            {getMessage("redGreyFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.toGreenAndGreyStatus, toGreenAndGrey)
            }
          >
            {getMessage("greenGreyFilter")}
          </Button>
          <Button
            type="primary"
            className={styles.operationBtn}
            onClick={() =>
              doTask(imgStatusInfo.current.toBlueAndGreyStatus, toBlueAndGrey)
            }
          >
            {getMessage("blueGreyFilter")}
          </Button>
          {["JPG", "JPEG"].includes(imgInfo.fileType) && (
            <Button
              type="primary"
              className={styles.operationBtn}
              onClick={() =>
                doTask(imgStatusInfo.current.jpgToPngStatus, jpgToPng, "PNG")
              }
            >
              {getMessage("jpgToPng")}
            </Button>
          )}
          {imgInfo.fileType === "PNG" && (
            <Button
              type="primary"
              className={styles.operationBtn}
              onClick={() =>
                doTask(imgStatusInfo.current.pngToJpgStatus, pngToJpg, "JPEG")
              }
            >
              {getMessage("pngToJpg")}
            </Button>
          )}
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

export default BasicOperation;
