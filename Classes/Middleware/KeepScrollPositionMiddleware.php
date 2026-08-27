<?php

declare(strict_types=1);

namespace Itx\KeepScrollPosition\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Http\HtmlResponse;
use TYPO3\CMS\Core\Utility\PathUtility;

/**
 * Injects the keep-scroll-position JavaScript into every backend response.
 *
 * This must be a PSR-15 middleware (rather than the AfterBackendPageRenderEvent)
 * because backend modules are rendered as their own, separate HTML documents
 * inside an iframe (the "content container") - AfterBackendPageRenderEvent only
 * fires for the outer shell (top bar + module menu), never for the module's own
 * iframe document, so a middleware is needed to reach the actual module content.
 */
final class KeepScrollPositionMiddleware implements MiddlewareInterface
{
    private const DEFAULT_MODULES = 'web_layout';

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $response = $handler->handle($request);

        $contentType = $response->getHeaderLine('Content-Type');
        if ($contentType !== '' && !str_contains($contentType, 'text/html')) {
            return $response;
        }

        $body = (string)$response->getBody();
        if (!str_contains($body, '</body>')) {
            return $response;
        }

        $modules = $this->getConfiguredModules($request);

        $body = preg_replace(
            '/<body([^>]*)>/i',
            '<body$1 data-keep-scroll-position-modules="' . htmlspecialchars(implode(',', $modules), ENT_QUOTES) . '">',
            $body,
            1
        );

        $script = '<script src="' . PathUtility::getPublicResourceWebPath(
            'EXT:keep_scroll_position/Resources/Public/JavaScript/keep-scroll-position.js'
        ) . '"></script>';

        $body = str_replace('</body>', $script . '</body>', $body);

        return new HtmlResponse($body, $response->getStatusCode(), $response->getHeaders());
    }

    /**
     * @return string[]
     */
    private function getConfiguredModules(ServerRequestInterface $request): array
    {
        $pageId = (int)($request->getParsedBody()['id'] ?? $request->getQueryParams()['id'] ?? 0);
        $modulesConfig = self::DEFAULT_MODULES;

        if ($pageId > 0) {
            $pageTsConfig = BackendUtility::getPagesTSconfig($pageId);
            $modulesConfig = $pageTsConfig['mod.']['keep_scroll_position.']['modules'] ?? self::DEFAULT_MODULES;
        }

        return array_filter(array_map('trim', explode(',', (string)$modulesConfig)));
    }
}
