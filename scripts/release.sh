#!/bin/bash

# APISIX Web UI 发布脚本
# 使用方法: ./scripts/release.sh [版本号]
# 例如: ./scripts/release.sh 1.0.0

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# 检查参数
if [ $# -eq 0 ]; then
    log_error "请提供版本号，例如: ./scripts/release.sh 1.0.0"
fi

VERSION=$1
TAG="v$VERSION"

# 验证版本号格式
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    log_error "版本号格式不正确，请使用 x.y.z 格式，例如: 1.0.0"
fi

log_info "准备发布版本: $VERSION"

# 检查是否在 git 仓库中
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "当前目录不是 git 仓库"
fi

# 检查工作区是否干净
if [ -n "$(git status --porcelain)" ]; then
    log_warning "工作区有未提交的更改："
    git status --short
    read -p "是否继续发布？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "发布已取消"
        exit 0
    fi
fi

# 检查是否在主分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "main" && "$CURRENT_BRANCH" != "master" ]]; then
    log_warning "当前不在主分支 (当前: $CURRENT_BRANCH)"
    read -p "是否继续发布？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "发布已取消"
        exit 0
    fi
fi

# 检查标签是否已存在
if git tag -l | grep -q "^$TAG$"; then
    log_error "标签 $TAG 已存在"
fi

# 更新 package.json 版本号
log_info "更新 package.json 版本号到 $VERSION"
if command -v npm > /dev/null 2>&1; then
    npm version $VERSION --no-git-tag-version
else
    # 如果没有 npm，使用 sed 更新版本号
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
    else
        # Linux
        sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json
    fi
fi

# 更新 CHANGELOG.md (如果存在)
if [ -f "CHANGELOG.md" ]; then
    log_info "检查 CHANGELOG.md"
    if ! grep -q "## \[$VERSION\]" CHANGELOG.md; then
        log_warning "CHANGELOG.md 中未找到版本 $VERSION 的更新记录"
        log_info "请手动更新 CHANGELOG.md 并重新运行此脚本"
        
        # 恢复 package.json
        git checkout package.json
        exit 1
    fi
fi

# 运行测试 (如果存在)
if grep -q '"test"' package.json; then
    log_info "运行测试..."
    npm test
fi

# 构建项目
log_info "构建项目..."
if npm run build; then
    log_success "构建成功"
else
    log_error "构建失败"
fi

# 提交更改
log_info "提交版本更新..."
git add package.json
if [ -f "package-lock.json" ]; then
    git add package-lock.json
fi
if [ -f "CHANGELOG.md" ]; then
    git add CHANGELOG.md
fi

git commit -m "chore: bump version to $VERSION

- 更新版本号到 $VERSION
- 准备发布新版本
"

# 创建标签
log_info "创建标签 $TAG..."
git tag -a $TAG -m "release: version $VERSION

发布版本 $VERSION

## 构建信息
- 构建时间: $(date '+%Y-%m-%d %H:%M:%S')
- 构建分支: $CURRENT_BRANCH
- 提交哈希: $(git rev-parse HEAD)

## 下载地址
- Windows: APISIX-Web-UI-Setup-$VERSION.exe
- macOS: APISIX-Web-UI-$VERSION-x64.dmg (Intel) / APISIX-Web-UI-$VERSION-arm64.dmg (Apple Silicon)  
- Linux: apisix-web-ui-$VERSION-x64.AppImage
- Web版本: apisix-web-ui-web-$TAG.zip

详细更新内容请查看 CHANGELOG.md
"

# 推送到远程仓库
log_info "推送到远程仓库..."
git push origin $CURRENT_BRANCH
git push origin $TAG

log_success "版本 $VERSION 发布成功！"
log_info "GitHub Actions 将自动构建并发布到 GitHub Releases"
log_info "发布页面: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/releases/tag/$TAG"

# 可选：打开浏览器
if command -v open > /dev/null 2>&1; then
    read -p "是否打开 GitHub 发布页面？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        REPO_URL=$(git config --get remote.origin.url | sed 's/git@github.com:/https:\/\/github.com\//' | sed 's/\.git$//')
        open "$REPO_URL/releases/tag/$TAG"
    fi
fi

log_success "发布流程完成！"
