// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

// 保留 getAdcode 函数名，复用 getWeather 函数获取城市信息
export const getAdcode = async (ip = '') => {
  const weatherData = await getWeather(ip, 1);
  return {
    city: weatherData.city,
    path: weatherData.path,
    country: weatherData.country
  };
};

// 修改获取天气信息的接口为新 API
export const getWeather = async (ip = '', days = 1) => {
  const url = new URL('https://node.api.xfabe.com/api/weather/get');
  if (ip) {
    url.searchParams.append('ip', ip);
  }
  if (days) {
    url.searchParams.append('day', days);
  }

  const res = await fetch(url);
  const data = await res.json();
  
  if (data.code === 200) {
    return data.data;
  } else {
    throw new Error(data.msg || '获取天气信息失败');
  }
};

