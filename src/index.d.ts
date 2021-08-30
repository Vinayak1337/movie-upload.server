import { Grid } from 'gridfs-stream'

export type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];

export type CustomOrigin = (requestOrigin: string | undefined, callback: (err: Error | null, origin?: StaticOrigin) => void) => void;

export type GridFsStore = {
    videoStore: null | Grid,
    thumbnailStore: null | Grid,
}