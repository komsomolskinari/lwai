<xsl:stylesheet	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:str="http://exslt.org/strings" version="1.0">
	<xsl:output method="html" encoding="UTF-8" indent="no" media-type="text/html" />
	<xsl:strip-space elements="*" />

	<xsl:template name="size">
		<xsl:param name="bytes"/>
		<xsl:value-of select="$bytes" />B</xsl:template>
	<xsl:template name="timestamp">
		<xsl:param name="iso-timestamp" />
		<xsl:value-of select="concat(substring($iso-timestamp, 0, 11), ' ', substring($iso-timestamp, 12, 8))" />
	</xsl:template>

	<xsl:template match="directory">
		<tr>
			<td>
				<a href="{str:encode-uri(current(),true())}/"><xsl:value-of select="."/>/</a>
			</td>
			<td>
				<xsl:call-template name="timestamp">
					<xsl:with-param name="iso-timestamp" select="@mtime" />
				</xsl:call-template>
			</td>
			<td>-</td>
		</tr>
	</xsl:template>

	<xsl:template match="file">
		<tr>
			<td>
				<a href="{str:encode-uri(current(),true())}">
					<xsl:value-of select="." />
				</a>
			</td>
			<td>
				<xsl:call-template name="timestamp">
					<xsl:with-param name="iso-timestamp" select="@mtime" />
				</xsl:call-template>
			</td>
			<td>
				<xsl:call-template name="size">
					<xsl:with-param name="bytes" select="@size" />
				</xsl:call-template>
			</td>
		</tr>
	</xsl:template>

	<xsl:template match="/">
		<xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
		<html>
			<head>
				<title>Index of <xsl:value-of select="$path"/>
				</title>
				<style><xsl:value-of select="document('index.css.xml')"/></style>
				<script><xsl:value-of select="document('index.js.xml')"/></script>
			</head>
			<body>
				<h1>Index of <span id="path"><xsl:value-of select="$path"/></span>
				</h1>
				<table>
					<thead>
						<tr>
							<th class="selected">Name</th>
							<th>Last Modified</th>
							<th>Size</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><a href="../">../</a></td>
							<td>-</td>
							<td>-</td>
						</tr>
						<xsl:apply-templates />
					</tbody>
				</table>
				<p><xsl:value-of select="count(//directory)"/> directories, <xsl:value-of select="count(//file)"/> files, <span id="sumsize"><xsl:call-template name="size"><xsl:with-param name="bytes" select="sum(//file/@size)" /></xsl:call-template></span> total</p>
				<p>Powerded by NGINX with lwai</p>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>