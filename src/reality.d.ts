/// <reference types="cesium" />
import { Cartographic } from './cesium/cesium-imports';
import { ContextFrameState } from './common';
import { SessionPort, SessionService } from './session';
import { Event } from './utils';
import { EntityService } from './entity';
import { FocusServiceProvider } from './focus';
import { VisibilityServiceProvider } from './visibility';
import { RealityViewer } from './reality-viewers/base';
import { ViewServiceProvider } from './view';
import { DeviceService } from './device';
export declare abstract class RealityFactory {
    abstract createRealityViewer(uri: string): RealityViewer;
}
/**
* A service which makes requests to manage the reality viewer.
*/
export declare class RealityService {
    private sessionService;
    /**
     * An event that provides a session for sending / receiving
     * commands to / from a reality.
     *
     * The session passed via this event can represent either endpoint of
     * a connection between RealityViewer <--> RealityAugmenter/RealityManager.
     *
     * If running in a RealityAugmenter, the session
     * represents a connection to a RealityViewer.
     *
     * If running in a RealityViewer, the session
     * represents a connection to a RealityAugmenter.
     */
    readonly connectEvent: Event<SessionPort>;
    private _connectEvent;
    /**
     * A collection of connected sessions.
     *
     * If running in a RealityAugmenter, this collection
     * represents connections to any loaded RealityViewers.
     *
     * If running in a RealityViewer, this collection
     * represents connections to any RealityAugmenters.
     */
    readonly sessions: SessionPort[];
    private _sessions;
    /**
     * An event that is raised when the presenting reality viewer is changed.
     */
    readonly changeEvent: Event<{
        previous?: string | undefined;
        current: string;
    }>;
    private _changeEvent;
    /**
     * The URI for the currently presenting Reality Viewer.
     */
    readonly current: string | undefined;
    private _current?;
    /**
     * The default Reality Viewer.
     */
    default: string;
    /**
     * Whether the current reality viewer shares a canvas with the reality augmenter.
     */
    readonly isSharedCanvas: boolean;
    _sharedCanvas: boolean;
    constructor(sessionService: SessionService);
    /**
     * @private
     */
    _processContextFrameState(frameState: ContextFrameState): void;
    /**
     * @private
     */
    _publishContextFrameState(frameState: ContextFrameState): void;
    /**
     * Install the specified reality viewer
     */
    install(uri: string): Promise<void>;
    /**
     * Uninstall the specified reality viewer
     */
    uninstall(uri: string): Promise<void>;
    /**
     * Request a reality viewer to be presented.
     * - Pass a url to request a (custum) hosted reality viewer
     * - [[RealityViewer.DEFAULT]] to request the system default reality viewer
     * - [[RealityViewer.LIVE]] to request a live reality viewer
     * - [[RealityViewer.WEBTRC]] to request a webrtc reality viewer
     * - [[RealityViewer.EMPTY]] to request an empty reality viewer
     * - [[RealityViewer.TANGO]] to request a Tango reality viewer
     */
    request(uri: string): Promise<void>;
    /**
     * Deprecated. Use [[RealityService#request]]
     * @deprecated
     */
    setDesired(reality: {
        uri: string;
    } | undefined): void;
    /**
     * Ask a reality to move the stage to the given geolocation
     */
    setStageGeolocation(realitySession: SessionPort, geolocation: Cartographic): Promise<void>;
    /**
     * Ask a reality to move the stage to the given geolocation
     */
    resetStageGeolocation(realitySession: SessionPort): Promise<void>;
}
export declare class RealityServiceProvider {
    private sessionService;
    private realityService;
    private entityService;
    private deviceService;
    private viewServiceProvider;
    private visibilityServiceProvider;
    private focusServiceProvider;
    private realityViewerFactory;
    /**
     * An event that is raised when a reality viewer is installed.
     */
    installedEvent: Event<{
        viewer: RealityViewer;
    }>;
    /**
     * An event that is raised when a reality viewer is uninstalled.
     */
    uninstalledEvent: Event<{
        viewer: RealityViewer;
    }>;
    /**
     * An event that is raised when the next frame state is published
     */
    nextFrameStateEvent: Event<ContextFrameState>;
    readonly presentingRealityViewer: RealityViewer | undefined;
    private _presentingRealityViewer;
    private _viewerByURI;
    private _installersByURI;
    constructor(sessionService: SessionService, realityService: RealityService, entityService: EntityService, deviceService: DeviceService, viewServiceProvider: ViewServiceProvider, visibilityServiceProvider: VisibilityServiceProvider, focusServiceProvider: FocusServiceProvider, realityViewerFactory: RealityFactory);
    private _scratchFrustum;
    private _handleInstall(session, uri);
    private _connectViewerWithSession(viewerSession, session);
    protected _handleUninstall(session: SessionPort, uri: string): Promise<never>;
    protected _handleRequest(session: SessionPort, options: {
        uri: string;
    }): Promise<void>;
    private _setPresentingRealityViewer(viewer);
    getViewerByURI(uri: string): RealityViewer | undefined;
    removeInstaller(installerSession: SessionPort): void;
}
